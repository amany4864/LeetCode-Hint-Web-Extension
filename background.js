// Listen for messages from content script




  chrome.storage.local.get(null, function(items) {
    console.log('All stored items:', items);
    for (let key in items) {
      if (items.hasOwnProperty(key)) {
        console.log(`Key: ${key}, Value:`, items[key]);
      }
    }
    if (chrome.runtime.lastError) {
      console.error('Storage error:', chrome.runtime.lastError);
    }
  });
  
  
  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === 'getHint') {
      // Get API key from local storage (only thing we store)
      chrome.storage.local.get(['apiKey', 'model'], function(data) {
        if (!data.apiKey) {
          sendResponse({error: 'Please set your Groq API key in the extension settings.'});
          return;
        }
        
        // Call Groq API directly without storing problem data
        fetchHintFromGroq(data.apiKey, data.model, request.data)
          .then(hint => {
            try {
              sendResponse({hint: hint});
            } catch (err) {
              console.error('Error sending response:', err);
            }
          })
          .catch(error => {
            try {
              sendResponse({error: 'Error: ' + error.message});
            } catch (err) {
              console.error('Error sending error response:', err);
            }
          });
      });
      
      // Return true to indicate we will send a response asynchronously
      return true;
    }
    
    // For saving API key from popup
    if (request.action === 'saveSettings') {
      chrome.storage.local.set({
        apiKey: request.apiKey,
        model: request.model
      }, function() {
        try {
          sendResponse({status: 'Settings saved'});
        } catch (err) {
          console.error('Error sending settings saved response:', err);
        }
      });
      return true;
    }
  });
  
  
  async function fetchHintFromGroq(apiKey, model, data) {
    const { doubt, problemTitle, problemDescription } = data;
    
    // Construct prompt for the LLM
    const prompt = `
  You are a helpful LeetCode coding assistant. You provide hints without giving away the full solution.
  
  PROBLEM TITLE: ${problemTitle}
  
  PROBLEM DESCRIPTION: 
  ${problemDescription}
  
  USER'S DOUBT:
  ${doubt}
  
  Please provide a helpful hint that guides the user in the right direction without solving the problem completely. Include:
  1. A clarification of the concept they're struggling with
  2. A small nudge in the right direction
  3. If very hard/difficult implementation then only, a small code snippet that demonstrates the concept but doesn't solve the problem
  
  Your hint should be clear, concise, and educational.
  `;
  
    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: model || 'llama-3.3-70b-versatile',
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 1000
        })
      });
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error.message || 'Unknown error occurred');
      }
      
      return data.choices[0].message.content;
    } catch (error) {
      throw error;
    }
  }
  