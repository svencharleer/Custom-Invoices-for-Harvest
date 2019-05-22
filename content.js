
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
    //SAVE BUTTON PRESSED. SCRAPE THE PAGE FOR ENTRIES. SAVE TO SESSION
      if( request.message === "saveButtonPressed" ) {
            var currentTranslations = {}
            $("#edit_profile").children().each(
                function(i,d){
                    
                    
                    if(d.className == "hui-form-field")
                    {
                        var name_value = {
                            name: $(d).children()[0].children[0].textContent,
                            value: $($(d).children()[1].children[0]).val(),

                        }
                        currentTranslations[$(d).children()[1].children[0].id]
                            = name_value;

                        
                    }

                }
            )
            
            chrome.runtime.sendMessage({"message": "scrapeTranslationsAndSave", saveName: request.saveName, "translations": currentTranslations},
            );
            
            }

    //LOAD SELECTED ENTRIES AND FILL THEM INTO INPUT FIELDS
    if( request.message === "loadButtonPressed" ) {
            
            var data = request.data;
            Object.keys(data).forEach(function(key){
                $("#"+key).val(data[key].value);
            });
            
            }
        }
)
