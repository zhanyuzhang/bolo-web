define(function (require, exports, module) {
   'use strict';
   var $ = require('jquery@1-11-x');
   var Class = require('/common/user/1-0-x/modules/Class');

   /**
    * @name Module
    * @class 模块基类
    * @constructor
    * @param {HTMLElement} elem
    * @param {Object} config
    */
   var Module = Class.extend({
      defaults: {
      },
      
      init: function (elem, config) {
         if (typeof elem !== 'string') {
            this.$elem = elem;
         }
         this.config = $.extend({}, this.defaults, config);
         this.data = this.config.data;
         this.isBindEvent = false;
      },

      /**
       * 渲染节点
       *
       * @method render
       * @return {HTMLElement}
       */
      render: function () {
         if (!this.$elem) {
            var preData = this.preRender();
            var data = $.extend(preData, this.data);
            this.$elem = this.renderTmpl(data);
         }
         if (!this.isBindEvent) {
            this.postRender();
            this.bindEvent();
            this.isBindEvent = true;
         }
         return this.$elem;
      },
      
      /**
       * 渲染模板前处理数据
       *
       * @method preRender
       */
      preRender: function () {
         return {};
      },

      /**
       * 渲染模板后处理数据
       *
       * @method postRender
       */
      postRender: function () {
      },
      
      /**
       * 渲染模板
       *
       * @method renderTmpl
       */
      renderTmpl: function (data) {
         throw ('Abstract Method!!!');
      },
      
      /**
       * 处理模板所以数据
       *
       * @method parseData
       */
      parseData: function (data) {
         return data;
      },
      
      /**
       * 绑定事件
       *
       * @method bindEvent
       */
      bindEvent: function () {
         this.isBindEvent = true;
      }
   });

   return Module;
});