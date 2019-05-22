
 
 //SAVING TO SESSION
 chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        
      if( request.message === "scrapeTranslationsAndSave" ) {
          
          var save = {};
        save[request.saveName] =  request.translations;            
                    chrome.storage.sync.set(save, function() {
                        
                });
      }
    });
