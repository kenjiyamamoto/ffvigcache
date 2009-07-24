window.addEventListener("load", function() { myExtension.init(); }, false);

var myExtension = {
  urlAmbiente: '',
  urlParaLimpar: '',
  urlLimpaCache: '/sistemas/testes/teste-LimpaCacheForm',
  exibeRodaCount: 0,

  init: function() {
    $jq('#my-panel').css('display', 'none');
    $jq('#my-panel').click(myExtension.onClick);
    
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
      $jq('#my-panel').css('display', 'block');
      myExtension.urlAmbiente   = 'http://'+doc.location.href.split('/')[2];
      myExtension.urlParaLimpar = doc.location.href.split(myExtension.urlAmbiente)[1];
    }
    else {
      $jq('#my-panel').css('display', 'none');
    }
  },
  
  onClick: function(event) {
    if (event.button == 0) { //Left click
        myExtension.limparHtml();
        myExtension.limparJSs();
        myExtension.limparCSSs();
    } if (event.button == 1) { //Middle click
        myExtension.easterEgg();
    } else {    //Right click (maybe :-))
        myExtension.limparHtml();
    }
  },
  
  limparHtml: function() {
        myExtension.exibirRoda();
        $jq.ajax({
                  url: myExtension.urlAmbiente + myExtension.urlLimpaCache,
                  type: "GET",
                  data: {'path' : myExtension.urlParaLimpar},
                  dataType: "html",
                  success: myExtension.onLeftClickCallback,
                  error:   function(XMLHttpRequest, textStatus, errorThrown){ 
                    myExtension.onError(); 
                  },
                  complete:function(XMLHttpRequest, textStatus){ 
                    $jq('#my-panel image').get(0).src = 'chrome://ffvigcache/content/vignette-white-small.gif'; 
                  }
        });
  },
  
  limparJSs: function() {
        var doc = window.content.document;
        $jq('head script[src*=".js"]', doc).each(
              function() {
                    myExtension.exibirRoda();
                    this.src;
                    var urlParaLimpar = '/'+this.src.split('.com/')[1];
                    $jq.ajax({
                              url: myExtension.urlAmbiente + myExtension.urlLimpaCache,
                              type: "GET",
                              data: {'path' : urlParaLimpar},
                              dataType: "html",
                              success: myExtension.onLeftClickCallback,
                              error:   function(XMLHttpRequest, textStatus, errorThrown){ 
                                myExtension.onError(); 
                              },
                              complete:function(XMLHttpRequest, textStatus){
                                myExtension.esconderRoda(); 
                              }
                    });
              }
        );
  },
  
  limparCSSs: function() {
        var doc = window.content.document;
        $jq('head link[href*=".css"]', doc).each(
              function() {
                    myExtension.exibirRoda();
                    this.src;
                    var urlParaLimpar = '/'+this.href.split('.com/')[1];
                    $jq.ajax({
                              url: myExtension.urlAmbiente + myExtension.urlLimpaCache,
                              type: "GET",
                              data: {'path' : urlParaLimpar},
                              dataType: "html",
                              success: myExtension.onLeftClickCallback,
                              error:   function(XMLHttpRequest, textStatus, errorThrown){ 
                                myExtension.onError(); 
                              },
                              complete:function(XMLHttpRequest, textStatus){
                                myExtension.esconderRoda(); 
                              }
                    });
              }
        );
  },
  
  //TODO refatorar o nome deste método para algo mais genérico
  onLeftClickCallback: function(data) {
    if (data.search("limpo com sucesso") < 0) {
        myExtension.onError();
    }
  },
  
  onError: function() {
    alert('Não foi possível limpar o cache do path: ' + myExtension.urlParaLimpar + '\nO serviço de limpeza pode estar indisponível.\nUrl do serviço: ' + myExtension.urlAmbiente + myExtension.urlLimpaCache);
  },
  
  exibirRoda(): function() {
    myExtension.exibeRodaCount++;
    $jq('#my-panel image').get(0).src = 'chrome://ffvigcache/content/loading-green.gif';  
  },
  
  esconderRoda(): function() {
    myExtension.exibeRodaCount--;
    if (myExtension.exibeRodaCount == 0)
        $jq('#my-panel image').get(0).src = 'chrome://ffvigcache/content/vignette-white-small.gif';
  },
  
  easterEgg: function() {
    var rand = Math.floor(Math.random()*10 % 4 + 1);
    var eggFile = 'chrome://ffvigcache/content/cow' +rand+ '.gif'; 
    $jq('#my-panel image').get(0).src = eggFile;
    setTimeout(
        function() { $jq('#my-panel image').get(0).src = 'chrome://ffvigcache/content/vignette-white-small.gif'; },
        2000
    );
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
        $jq('a', doc).each(function()
                    { 
                      str += this.href;
                    }
                   )

        alert(str);
    }
    
} // Utils

