$( document ).ready(function() {
    console.log( "ready!" );

var language;



function searchQuestionAndAnswer(){
        $( "body" ).removeClass( ".ui-state-focus" )

        if (language === "All" || language === undefined ){
            language = ""  
          }

        var autosearch = [];
        var questionToAnswer = []
        var title = []
        console.log(autosearch)
        var clickedTitle;
        var passQuestionIdToAjax;
      
      $.ajax({
        type: 'GET',
        dataType: 'json',
        url:"https://api.stackexchange.com/2.2/questions?order=desc&sort=activity&tagged="+ language + "&site=stackoverflow"
      }).done(function(response){
        

          for(i = 0; i < response["items"].length; i++){
           autosearch.push({ label: response["items"][i]["title"], category: language });
           questionToAnswer.push({ label: response["items"][i]["title"], questionId: response["items"][i]["question_id"] });
            
      }

          $( "#search" ).catcomplete({
              delay: 0,
              source: autosearch, 
              select:function(event, ui){            
                clickedTitle = ui["item"]["label"]

                for (q = 0; q < questionToAnswer.length; q++){
                  
                    var questionMatch  = (questionToAnswer[q].label.includes(clickedTitle))
                    if (questionMatch == 1){
                      passQuestionIdToAjax = questionToAnswer[q].questionId
                      
                    }
                }

               $.ajax({
                 type: 'GET',
                 dataType: 'json',
                 url: "https://api.stackexchange.com/2.2/questions/" + passQuestionIdToAjax +"/answers?order=desc&sort=activity&site=stackoverflow&filter=!-*f(6t0WVmuu" 
               }).done(function(response){

                  console.log(response["items"])

                  if(response["items"].length === 0){
                      $("#noanswer").append("<li>Sorry, no code snippets avaliable</li>");
                
                  } 


                  else{

                      for(i = 0; i < response["items"].length; i++){ 

                          // var jqueryball = $(response["items"][i]["body"])

                          var el = document.createElement("div");
                          el.innerHTML = response["items"][i]["body"];
                          // console.log(el.innerHTML)
                       

                            for(var x = 0; x < el.childNodes.length; x++){
                          // Iterating over all the <pre> tags in the present answer
                              if(el.childNodes[x].localName === "pre"){
                                // console.log(el.childNodes[x])
                                // console.dir(el.childNodes[x].innerHTML);
                             
                                $("#answers").append("\
                                  <div class='row'>\
                                    <div class='col s12 m7'>\
                                      <div class='card'>\
                                        <div class='card-image'>"+ el.childNodes[x].innerHTML + "</div>\
                                        <div class='card'>\
                                        </div>\
                                        <div class='card-content'>\
                                          <span class='card-title activator grey-text text-darken-4'>Upvotes: " + response["items"][i]["score"] + "<i class='mdi-navigation-more-vert right'></i></span>\
                                        <p>\
                                          <a href='http://www.stackoverflow.com/a/" + response["items"][i]["answer_id"] + "'>Source</a>\
                                        </p>\
                                        </div>\
                                        <div class='card-reveal'>\
                                          <span class='card-title grey-text text-darken-4'>Context <i class='mdi-navigation-close right'></i></span>\
                                        <p class='details'>" + response["items"][i]["body"] + "</p>\
                                        </div>\
                                      </div>\
                                    </div>\
                                  </div>")
                           
                              } // end of for if statement for el.childNodes[x].localName 



                            } // end of for loop of el.childNodes.length
                          

                        }   // end of for loop for response items  

                        if($('#answers').is(':empty')){
                           $("#noanswer").append("<li>Sorry, no code snippets avaliable</li>");
                        }         
      
                 } // end of else condition
                
               })
              }

          }); // end of search 

     });   
}


 $.widget( "custom.catcomplete", $.ui.autocomplete, {
    _create: function() {
      this._super();
      this.widget().menu( "option", "items", "> :not(.ui-autocomplete-category)" );
    },
    _renderMenu: function( ul, items ) {
      var that = this,
        currentCategory = "";
      $.each( items, function( index, item ) {
        var li;
        if ( item.category != currentCategory ) {
          ul.append( "<li class='ui-autocomplete-category'>" + item.category + "</li>" );
          currentCategory = item.category;
        }
        li = that._renderItemData( ul, item );
        if ( item.category ) {
          li.attr( "aria-label", item.category + " : " + item.label );
        }
      });
    }
  });


  jQuery.ui.autocomplete.prototype._resizeMenu = function () {
    var ul = this.menu.element;
    ul.outerWidth(this.element.outerWidth());
  }



 $("#search").click(function(){
    $(this).val(""); 
    $( "#square" ).empty(); 
    $( "#answers" ).empty();
    $( "#noanswer" ).empty();  
    $( "#testanswers" ).empty();  
    language;
    
    searchQuestionAndAnswer()
  });
    

  // $("#searchtype").change(function(){
  //     $( "#square" ).empty();  
  //     $( "#answers" ).empty(); 
  //     $( "#noanswer" ).empty();      
  //     $( "#testanswers" ).empty();       
  //     searchQuestionAndAnswer()
  //  });


  $("#dropdown1").click(function(event){
    language = $(event.target).text(); 

    $('#dropdown_option').text(language);

    // console.log("ive been clicked")
    // var language = $(event.target).text();
    // language = $(event.target).text();  
    searchQuestionAndAnswer()
  })

  $("#floating-btn").click(function(){
    window.scrollTo(0, 0);
  })

 });
