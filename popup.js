var allData = {};

$(document).ready(function() {

    // GET ALL DATA FROM SESSION. CREATE LISTING
    chrome.storage.sync.get(null, function(result) {
        allData = result;
        if(allData == undefined || Object.keys(allData).length == 0)
        {
            var element = $("<a>Please save a custom invoice first.</a>")
            $("#saved_translations")
                .append(element);
            element.attr("class","collection-item  pink-text darken-1-text");
            return;
        }
        
        Object.keys(allData).forEach(function(key){
            //name of entry to load
            var element = $("<a>"+key+"</a>")
            //var element = $("<span>" +key+ "</span>");
            $("#saved_translations")
                .append(element);
            element.attr("class","collection-item  pink-text darken-1-text");
            element.click(function(event){event.stopPropagation();loadSave(key)});
            //delete button
            var subelement = $("<span><i class='fas fa-trash'></i></span><br/>");
            element
                .append(subelement);
            subelement.attr("class","badge  pink-text darken-1-text");
            subelement.click(function(event){event.stopPropagation();deleteSave(key)});
      
        })
    })

    // SAVE CALLS SCRAPE ACTION IN CONTENT.JS
    //alldata might not be alive yet, but it should be once the user pushes this button
    $("#saveButton").click(function(event) {
        event.stopPropagation();
        var save = {};
        var saveName = $("<div>").text($("#saveName").val()).html();
        if(saveName === "") {
            alert("Please provide a name for this entry")
            return;
        }
        //does save name exist? prompt user
        var confirmation = true;
        if(allData[saveName] != undefined)
        {
            confirmation = confirm("The entry " + saveName + " exists already. Do you wish to overwrite?");
        }
        if(!confirmation) return;
        
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            var activeTab = tabs[0];
            chrome.tabs.sendMessage(
                activeTab.id, {"message": "saveButtonPressed", "saveName": saveName }
                
                    
            );
        });
    });

  });

  //ONCE SCRAPED, MESSAGE IS SENT TO STORE IN STORAGE
  chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        
      if( request.message === "scrapeTranslationsAndSave" ) {

          var save = {};
        save[request.saveName] =  request.translations;            
                    chrome.storage.sync.set(save, function() {
                        window.location.href = "popup.html";
                        
                });
      }
    });



// FUNCTIONS FOR LOADING/DELETING SAVES FROM POPUP
function loadSave(saveName)
{
    
    chrome.storage.sync.get(saveName, function(result) {
        console.log('Value is set to ' + result[saveName]);
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            var activeTab = tabs[0];
            chrome.tabs.sendMessage(
                activeTab.id, {"message": "loadButtonPressed", "data": result[saveName], "saveName": saveName },
            );
        });
        });
}

function deleteSave(saveName)
{
    var confirmation = true;
    confirmation = confirm("Do you want to delete " + saveName + "?");
    if(!confirmation) return;

    chrome.storage.sync.remove(saveName, function() {
        window.location.href = "popup.html";
       
    });
}
