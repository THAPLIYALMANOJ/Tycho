import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { ApiService } from '../../app/services/ApiService';
import {PDFJS} from 'pdfjs-dist';

/**
 * Generated class for the PacketDetails page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-packet-details',
  templateUrl: 'packet-details.html',
  providers: [ApiService]
})
export class PacketDetails {

  Class: any;
  currentLevel: String;
  currentSet: String;
  currentPacket: String;
  item: any;

  loading: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController,
              public apiService: ApiService) {
    // If we navigated to this page, we will have an item available as a nav param
    this.item = navParams.get('item');
    this.currentLevel = navParams.get('currentLevel');
    this.currentSet = navParams.get('currentSet');
    this.currentPacket = navParams.get('currentPacket');
    console.log(this.item);
    //loadPDF();
  }
  ionViewDidLoad() {
    //loadPDF();

    this.apiService.presentLoadingCustom();
    var url = '//cdn.mozilla.net/pdfjs/tracemonkey.pdf';
    url = 'assets/files/YGKschoolsofthought.pdf';
    url = 'assets/packets/'+this.currentLevel+'/'+this.currentSet+'/'+this.currentPacket;
    //url = this.selectedItem.url;
    var canvasContainer = document.getElementById("pdf-canvas");
    this.renderPDF(url, canvasContainer);
  }

  renderPDF(url, canvasContainer, options?) {
    var options = options || { scale: 1 };

    function renderPage(page) {
      //var viewport = page.getViewport(options.scale);
      console.log(canvasContainer.scrollWidth / page.getViewport(1.0).width);
      var viewport = page.getViewport(canvasContainer.scrollWidth / page.getViewport(1.0).width);
      var canvas = document.createElement('canvas');
      var ctx = canvas.getContext('2d');
      var renderContext = {
        canvasContext: ctx,
        viewport: viewport
      };

      canvas.height = viewport.height;
      canvas.width = viewport.width;
      canvasContainer.appendChild(canvas);

      page.render(renderContext);
    }

    function renderPages(pdfDoc) {
      var promiseList = [];
      for(var num = 1; num <= pdfDoc.numPages; num++) {
        var pn = pdfDoc.getPage(num);
        promiseList.push(pn.then(renderPage));
      }
      Promise.all(promiseList).then(function() {
        console.log("loaded");
        (<any>window).loading.dismiss();
      });
    }

    PDFJS.workerSrc = 'assets/files/pdf.worker.js';
    PDFJS.disableWorker = false;
    PDFJS.getDocument(url).then(renderPages);
  }

}
