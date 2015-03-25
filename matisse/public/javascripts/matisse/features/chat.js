/**
 * To handle sending/receiving and showing user chat
 */

define(["matisse", "matisse.comm"],
       function(matisse, commType) {
           
           function init(view) {
               commType.prototype.onDraw = 
                   (function (originalOnDraw) {
                        return function(data) {
                            if(data
                               && data.args 
                               && data.action == 'chat') {
                                view.showAlert(data.args[0].text);
                                view.showMessage(data.args[0].text);
                            } else {
                                originalOnDraw.call(matisse.comm, data);
                            }
                       };
                    })(commType.prototype.onDraw);

           }

           function view() {

               function showMessage(msg) {
                   $("#chattext").append('<li>' + msg + '</li>');
               }

               function showAlert(msg) {
                   if(! $('#chattext').is(':visible')) { // chat is not visible
                       $('#discussicon .notify ul')
                           .empty()
                           .append('<li>' + msg + '</li>');
                       $('#discussicon .notify').show().fadeOut(4000);
                   }
               }

               function sendMessage() {
                   if($("#chat").val()) { // has non-empty text
                       var msg = matisse.userName +': ' + $("#chat").val();
                       showMessage(msg);
                       matisse.comm.sendDrawMsg(
                           {
                               action: "chat",
                               args: [{text: msg}]
                           });
                   }
                   $("#chat").val('').focus();
               }

               $('#chatdialog').dialog();
               $('#chatdialog').dialog('close');
	       $('#chatbutton').click(sendMessage);

               // pressing 'enter' in text should also send msg (click on send)
               $('#chat').keyup(function(e) {
                                    if(e.keyCode == 13) {  // enter key
                                        $('#chatbutton').click();
                                    }
                                });

               return {
                   showMessage: showMessage,
                   showAlert: showAlert
               };
           }

           return {
               init: function() { init(view()); }
           };
       });
