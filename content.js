// Wait for page to fully load
window.addEventListener('load', function() {
    // Create hint button and panel
    createHintInterface();
  });
  
  function isDarkMode() {
    try {
      return document.body.classList.contains('dark') || 
             window.matchMedia('(prefers-color-scheme: dark)').matches ||
             getComputedStyle(document.body).backgroundColor.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/)[1] < 100;
    } catch (e) {
      return false;
    }
  }
  
  function createHintInterface() {
    // Check if we're on a LeetCode problem page
    if (!window.location.href.includes('/problems/')) return;
    
    // Create the hint button with improved styling
    const hintButton = document.createElement('button');
    hintButton.textContent = '🧠 Get Hint';
    hintButton.style.cssText = `
      position: fixed; 
      bottom: 20px; 
      right: 20px; 
      z-index: 1000; 
      padding: 10px 15px; 
      background-color: #3498db; 
      color: white; 
      border: none; 
      border-radius: 8px; 
      cursor: pointer; 
      font-weight: bold;
      font-size: 14px;
      box-shadow: 0 4px 8px rgba(0,0,0,0.2);
      transition: all 0.3s ease;
    `;
    
    // Add hover effect
    hintButton.onmouseover = function() {
      this.style.backgroundColor = '#2980b9';
      this.style.transform = 'translateY(-2px)';
    };
    hintButton.onmouseout = function() {
      this.style.backgroundColor = '#3498db';
      this.style.transform = 'translateY(0)';
    };
    
    // Create the hint panel with improved styling
    const hintPanel = document.createElement('div');
    hintPanel.style.cssText = `
      position: fixed; 
      bottom: 80px; 
      right: 20px; 
      width: 350px; 
      max-height: 500px; 
      overflow-y: auto; 
      background-color: #2d2d2d; 
      border: 1px solid #444; 
      border-radius: 12px; 
      padding: 20px; 
      z-index: 1000; 
      display: none; 
      box-shadow: 0 8px 16px rgba(0,0,0,0.3); 
      color: #e0e0e0;
      font-family: 'Arial', sans-serif;
    `;
    
    // Add header to the panel
    const panelHeader = document.createElement('div');
    panelHeader.style.cssText = `
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
      padding-bottom: 15px;
      border-bottom: 1px solid #444;
    `;
    
    const panelTitle = document.createElement('h3');
    panelTitle.textContent = '🧠 AI Coding Assistant';
    panelTitle.style.cssText = `
      margin: 0;
      color: #3498db;
      font-size: 16px;
    `;
    
    const closeButton = document.createElement('button');
    closeButton.innerHTML = '&times;';
    closeButton.style.cssText = `
      background: none;
      border: none;
      color: #999;
      font-size: 20px;
      cursor: pointer;
      padding: 0 5px;
    `;
    closeButton.onclick = function() {
      hintPanel.style.display = 'none';
    };
    
    panelHeader.appendChild(panelTitle);
    panelHeader.appendChild(closeButton);
    hintPanel.appendChild(panelHeader);
    
    // Create input for user's doubt with improved styling
    const doubtInput = document.createElement('textarea');
    doubtInput.placeholder = 'What are you stuck on? Describe your doubt here...';
    doubtInput.style.cssText = `
      width: 100%; 
      height: 100px; 
      margin-bottom: 15px; 
      padding: 12px; 
      box-sizing: border-box; 
      background-color: #3a3a3a; 
      color: #e0e0e0; 
      border: 1px solid #555;
      border-radius: 8px;
      font-family: 'Arial', sans-serif;
      font-size: 14px;
      resize: vertical;
      transition: border 0.3s ease;
    `;
    
    // Add focus effect
    doubtInput.onfocus = function() {
      this.style.border = '1px solid #3498db';
    };
    doubtInput.onblur = function() {
      this.style.border = '1px solid #555';
    };
    
    // Create submit button with improved styling
    const submitButton = document.createElement('button');
    submitButton.textContent = '🔍 Get AI Hint';
    submitButton.style.cssText = `
      padding: 12px; 
      background-color: #3498db; 
      color: white; 
      border: none; 
      border-radius: 8px; 
      cursor: pointer; 
      width: 100%; 
      font-weight: bold;
      font-size: 14px;
      transition: background-color 0.3s ease;
    `;
    
    // Add hover effect
    submitButton.onmouseover = function() {
      this.style.backgroundColor = '#2980b9';
    };
    submitButton.onmouseout = function() {
      this.style.backgroundColor = '#3498db';
    };
    
    // Create hint result area with improved styling
    const hintResult = document.createElement('div');
    hintResult.style.cssText = `
      margin-top: 20px; 
      padding-top: 20px; 
      border-top: 1px solid #444; 
      background-color: #1e1e1e; 
      padding: 0; 
      border-radius: 8px; 
      color: #e0e0e0;
      overflow: hidden;
      display: none;
    `;
    
    // Add elements to panel
    hintPanel.appendChild(doubtInput);
    hintPanel.appendChild(submitButton);
    hintPanel.appendChild(hintResult);
    
    // Add button and panel to page
    document.body.appendChild(hintButton);
    document.body.appendChild(hintPanel);
    
    // Toggle panel when button is clicked
    hintButton.addEventListener('click', function() {
      if (hintPanel.style.display === 'none') {
        hintPanel.style.display = 'block';
        doubtInput.focus();
      } else {
        hintPanel.style.display = 'none';
      }
    });
    
    // Handle hint request
    submitButton.addEventListener('click', function() {
      const doubt = doubtInput.value.trim();
      if (!doubt) {
        hintResult.style.display = 'block';
        hintResult.innerHTML = `
          <div style="padding: 15px; color: #ff6b6b; text-align: center; font-weight: bold;">
            ⚠️ Please describe what you're stuck on
          </div>
        `;
        return;
      }
      
      // Show loading indicator
      hintResult.style.display = 'block';
      hintResult.innerHTML = `
        <div style="padding: 15px; text-align: center;">
          <div class="loading-spinner" style="
            display: inline-block;
            width: 30px;
            height: 30px;
            border: 3px solid rgba(255,255,255,.3);
            border-radius: 50%;
            border-top-color: #3498db;
            animation: spin 1s ease-in-out infinite;
            margin-bottom: 10px;
          "></div>
          <div style="color: #e0e0e0; font-weight: bold;">Generating hint...</div>
        </div>
        <style>
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        </style>
      `;
      
      // Extract problem title using the correct selector
      const titleElement = document.querySelector('div.text-title-large a');
      const problemTitle = titleElement ? titleElement.textContent.trim() : '';
      
      // Extract problem description using the correct selector
      const descriptionElement = document.querySelector('div.elfjS[data-track-load="description_content"]');
      const problemDescription = descriptionElement ? descriptionElement.innerText : '';
      
      // Send message to background script without storing anything
      chrome.runtime.sendMessage({
        action: 'getHint',
        data: {
          doubt: doubt,
          problemTitle: problemTitle,
          problemDescription: problemDescription
        }
      }, function(response) {
        if (chrome.runtime.lastError) {
          console.error(chrome.runtime.lastError);
          hintResult.innerHTML = `
            <div style="padding: 15px; color: #ff6b6b; font-weight: bold;">
              ⚠️ Error: ${chrome.runtime.lastError.message}
            </div>
          `;
          return;
        }
        
        if (response && response.error) {
          hintResult.innerHTML = `
            <div style="padding: 15px; color: #ff6b6b; font-weight: bold;">
              ⚠️ ${response.error}
            </div>
          `;
        } else if (response && response.hint) {
          // Format the hint with better styling
          formatHint(response.hint, hintResult);
        }
      });
    });
    
    // Function to format the hint with syntax highlighting and better styling
    function formatHint(hintText, container) {
      // Create the hint container
      const hintContainer = document.createElement('div');
      hintContainer.style.cssText = `
        padding: 0;
        border-radius: 8px;
        overflow: hidden;
      `;
      
      // Add hint header
      const hintHeader = document.createElement('div');
      hintHeader.style.cssText = `
        background-color: #2c3e50;
        padding: 12px 15px;
        border-bottom: 1px solid #34495e;
      `;
      
      const hintTitle = document.createElement('div');
      hintTitle.innerHTML = '💡 <span style="font-weight: bold; color: #3498db;">Hint</span>';
      hintHeader.appendChild(hintTitle);
      hintContainer.appendChild(hintHeader);
      
      // Add hint content
      const hintContent = document.createElement('div');
      hintContent.style.cssText = `
        background-color: #2c3e50;
        padding: 15px;
        line-height: 1.6;
        font-size: 14px;
        color: #ecf0f1;
      `;
      
      // Regular expression to detect code blocks with triple backticks
      const codeBlockRegex = /``````/g;
      let lastIndex = 0;
      let match;
      let formattedText = hintText;
      const codeBlocks = [];
      
      // Find all code blocks and replace them with placeholders
      formattedText = formattedText.replace(codeBlockRegex, (match, language, code) => {
        const placeholder = `__CODE_BLOCK_${codeBlocks.length}__`;
        codeBlocks.push({ language: language || 'javascript', code: code.trim() });
        return placeholder;
      });
      
      // Split by placeholders and reconstruct with actual code blocks
      const parts = formattedText.split(/__CODE_BLOCK_\d+__/);
      const allParts = [];
      
      parts.forEach((part, index) => {
        if (part) {
          allParts.push({ type: 'text', content: part });
        }
        if (index < codeBlocks.length) {
          allParts.push({ 
            type: 'code', 
            language: codeBlocks[index].language, 
            content: codeBlocks[index].code 
          });
        }
      });
      
      // Add each part of the hint
      allParts.forEach(part => {
        if (part.type === 'text') {
          const textElement = document.createElement('div');
          textElement.style.cssText = `
            margin-bottom: 15px;
          `;
          textElement.innerHTML = part.content.replace(/\n/g, '<br>');
          hintContent.appendChild(textElement);
        } else if (part.type === 'code') {
          const codeBlockWrapper = document.createElement('div');
          codeBlockWrapper.style.cssText = `
            position: relative;
            background-color: #1e272e;
            border-radius: 6px;
            margin-bottom: 15px;
            overflow: hidden;
            border-left: 3px solid #3498db;
          `;
          
          // Add language label if available
          if (part.language && part.language !== 'text') {
            const languageLabel = document.createElement('div');
            languageLabel.style.cssText = `
              position: absolute;
              top: 0;
              left: 0;
              font-size: 12px;
              padding: 2px 6px;
              background-color: #3498db;
              color: white;
              border-bottom-right-radius: 4px;
            `;
            languageLabel.textContent = part.language;
            codeBlockWrapper.appendChild(languageLabel);
          }
          
          // Add copy button
          const copyButton = document.createElement('button');
          copyButton.style.cssText = `
            position: absolute;
            top: 5px;
            right: 5px;
            background-color: rgba(52, 152, 219, 0.7);
            color: white;
            border: none;
            border-radius: 4px;
            padding: 4px 8px;
            font-size: 12px;
            cursor: pointer;
            opacity: 0.8;
            transition: opacity 0.2s;
          `;
          copyButton.textContent = 'Copy';
          copyButton.onmouseover = function() {
            this.style.opacity = '1';
          };
          copyButton.onmouseout = function() {
            this.style.opacity = '0.8';
          };
          copyButton.onclick = function() {
            navigator.clipboard.writeText(part.content).then(
              function() {
                copyButton.textContent = 'Copied!';
                setTimeout(() => {
                  copyButton.textContent = 'Copy';
                }, 2000);
              },
              function() {
                copyButton.textContent = 'Error';
                setTimeout(() => {
                  copyButton.textContent = 'Copy';
                }, 2000);
              }
            );
          };
          codeBlockWrapper.appendChild(copyButton);
          
          // Add code block with padding to accommodate the language label and copy button
          const codeBlock = document.createElement('pre');
          codeBlock.style.cssText = `
            margin: 0;
            padding: 30px 12px 12px 12px;
            overflow-x: auto;
            font-family: 'Consolas', 'Monaco', monospace;
            font-size: 13px;
            line-height: 1.4;
          `;
          
          // Apply syntax highlighting
          const highlightedCode = highlightCode(part.content, part.language);
          codeBlock.innerHTML = highlightedCode;
          codeBlockWrapper.appendChild(codeBlock);
          
          hintContent.appendChild(codeBlockWrapper);
        }
      });
      
      hintContainer.appendChild(hintContent);
      container.innerHTML = '';
      container.appendChild(hintContainer);
    }
    
    // Function for syntax highlighting
    function highlightCode(code, language) {
      // Escape HTML characters first
      let escapedCode = code
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
      
      // Apply language-specific highlighting
      if (['javascript', 'js', 'typescript', 'ts'].includes(language.toLowerCase())) {
        return escapedCode
          .replace(/\b(function|return|if|else|for|while|var|let|const|class|import|export|from|try|catch|async|await)\b/g, '<span style="color: #c678dd;">$1</span>')
          .replace(/\b(true|false|null|undefined|this)\b/g, '<span style="color: #d19a66;">$1</span>')
          .replace(/("[^"]*"|'[^']*'|`[^`]*`)/g, '<span style="color: #98c379;">$1</span>')
          .replace(/\b(\d+)\b/g, '<span style="color: #d19a66;">$1</span>')
          .replace(/\/\/(.*)/g, '<span style="color: #5c6370;">\/\/$1</span>');
      } else if (['python', 'py'].includes(language.toLowerCase())) {
        return escapedCode
          .replace(/\b(def|class|if|else|elif|for|while|import|from|try|except|return|with|as|lambda|yield)\b/g, '<span style="color: #c678dd;">$1</span>')
          .replace(/\b(True|False|None|self)\b/g, '<span style="color: #d19a66;">$1</span>')
          .replace(/("[^"]*"|'[^']*'|"""[\s\S]*?"""|'''[\s\S]*?''')/g, '<span style="color: #98c379;">$1</span>')
          .replace(/\b(\d+)\b/g, '<span style="color: #d19a66;">$1</span>')
          .replace(/#(.*)/g, '<span style="color: #5c6370;">#$1</span>');
      } else if (['java', 'c', 'cpp', 'c++'].includes(language.toLowerCase())) {
        return escapedCode
          .replace(/\b(public|private|protected|class|interface|enum|extends|implements|new|this|super|return|if|else|for|while|do|switch|case|break|continue|try|catch|throw|throws|finally|static|final|void|int|char|boolean|byte|long|float|double)\b/g, '<span style="color: #c678dd;">$1</span>')
          .replace(/\b(true|false|null)\b/g, '<span style="color: #d19a66;">$1</span>')
          .replace(/("[^"]*")/g, '<span style="color: #98c379;">$1</span>')
          .replace(/\b(\d+)\b/g, '<span style="color: #d19a66;">$1</span>')
          .replace(/\/\/(.*)/g, '<span style="color: #5c6370;">\/\/$1</span>')
          .replace(/\/\*[\s\S]*?\*\//g, '<span style="color: #5c6370;">$&</span>');
      } else {
        // Generic highlighting for other languages
        return escapedCode;
      }
    }
  }
  