document.addEventListener('DOMContentLoaded', function() {
    // Load saved settings
    chrome.storage.local.get(['apiKey', 'model'], function(data) {
      if (data.apiKey) document.getElementById('apiKey').value = data.apiKey;
      if (data.model) document.getElementById('model').value = data.model;
    });
    
    // Save settings
    document.getElementById('saveSettings').addEventListener('click', function() {
      const apiKey = document.getElementById('apiKey').value;
      const model = document.getElementById('model').value;
      
      chrome.runtime.sendMessage({
        action: 'saveSettings',
        apiKey: apiKey,
        model: model
      }, function(response) {
        // Show success message
        alert('Settings saved successfully!');
      });
    });
  });
  