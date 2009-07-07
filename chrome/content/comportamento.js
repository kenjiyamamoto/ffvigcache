window.addEventListener("load", function() { myExtension.init(); }, false);

var myExtension = {
  urlAmbiente: '',
  urlParaLimpar: '',
  urlLimpaCache: '/sistemas/testes/teste-LimpaCacheForm',

  init: function() {
    $('#my-panel').css('display', 'none');
    $('#my-panel').click(myExtension.onLeftClick);
    
    var appcontent = document.getElementById("appcontent");   // browser
    if(appcontent) {
      appcontent.addEventListener("DOMContentLoaded", myExtension.onPageLoad, true);
      gBrowser.addEventListener("select", myExtension.onSelectTab, false);
    }
    
  },

  onPageLoad: function(aEvent) {
    //var doc = aEvent.originalTarget; // doc is document that triggered "onload" event
    myExtension.alterarContextoVignette();
  },
  
  onSelectTab: function(aEvent) {
    myExtension.onPageLoad(aEvent);
  },
  
  alterarContextoVignette: function(doc) {
    //exibe o botão se for uma página vignette e interna
    doc = Utils.mainWindow().content;
    if(doc.location.href.search("/0,,") > -1 && doc.location.href.search("globoi") > -1) {
      $('#my-panel').css('display', 'block');
      myExtension.urlAmbiente   = 'http://'+doc.location.href.split('/')[2];
      myExtension.urlParaLimpar = doc.location.href.split(myExtension.urlAmbiente)[1];
    }
    else {
      $('#my-panel').css('display', 'none');
    }
  },
  
  onLeftClick: function(event) {
    if (event.button == 0) {
        $('#my-panel image').get(0).src = 'chrome://ffvigcache/content/loading-green.gif';  
        $.get(myExtension.urlAmbiente + myExtension.urlLimpaCache, {'limpar' : myExtension.urlParaLimpar}, myExtension.onLeftClickCallback, 'html');
        $.ajax({
                  url: myExtension.urlAmbiente + myExtension.urlLimpaCache,
                  type: "GET",
                  data: {'limpar' : myExtension.urlParaLimpar},
                  dataType: "html",
                  success: function(msg){ },
                  error: function(XMLHttpRequest, textStatus, errorThrown){
                     myExtension.onError();
                  },
                  complete: function(XMLHttpRequest, textStatus){
                     myExtension.onLeftClickCallback();
                  }
        })
    }//if
  
  },
  
  onLeftClickCallback: function(data) {
    $('#my-panel image').get(0).src = 'chrome://ffvigcache/content/vignette-white-small.gif';  
    if (data.search("limpo com sucesso") == -1) {
        myExtension.onError();
    }
  },
  
  onError: function() {
    alert('Não foi possível limpar o cache do path: ' + myExtension.urlParaLimpar + '\nO serviço de limpeza pode estar indisponível.\nUrl do serviço: ' + myExtension.urlAmbiente + myExtension.urlLimpaCache);
  }
  
}



/*UTILS*/
var Utils = {
    mainWindow : function() {

        var mainWindow = window.QueryInterface(Components.interfaces.nsIInterfaceRequestor)
                       .getInterface(Components.interfaces.nsIWebNavigation)
                       .QueryInterface(Components.interfaces.nsIDocShellTreeItem)
                       .rootTreeItem
                       .QueryInterface(Components.interfaces.nsIInterfaceRequestor)
                       .getInterface(Components.interfaces.nsIDOMWindow); 


        //alert(mainWindow.content.location.href);
        return mainWindow;
    },

    test: function() {
        /*exemplo de como usar jquery para trabalhar dentro do documento aberto*/
        
        var doc = window.content.document;

        var str = '';
        $('a', doc).each(function()
                    { 
                      str += this.href;
                    }
                   )

        alert(str);
    }
    
} // Utils

