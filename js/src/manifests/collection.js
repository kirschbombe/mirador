(function($){

  $.Collection = function(collectionUri, location, collectionContent) {
    if (collectionContent) {
      jQuery.extend(true, this, {
          jsonLd: null,
          location: location,
          uri: collectionUri,
          request: null
      });
      this.initFromCollectionContent(collectionContent);
    } else {
      jQuery.extend(true, this, {
        jsonLd: null,
        location: location,
        uri: collectionUri,
        request: null
      });

      this.init(collectionUri);
    }
  };

  $.Collection.prototype = {
    init: function(collectionUri) {
      var _this = this;
      this.request = jQuery.ajax({
        url: collectionUri,
        dataType: 'json',
        async: true
      });

      this.request.done(function(jsonLd) {
        _this.jsonLd = jsonLd;
      });
    },
    initFromCollectionContent: function (collectionContent) {
      var _this = this;
      this.request = jQuery.Deferred();
      this.request.done(function(jsonLd) {
        _this.jsonLd = jsonLd;
      });
      _this.request.resolve(collectionContent); // resolve immediately
    },
    getVersion: function() {
      var versionMap = {
        'http://www.shared-canvas.org/ns/context.json': '1', // is this valid?
        'http://iiif.io/api/presentation/1/context.json': '1',
        'http://iiif.io/api/presentation/2/context.json': '2',
        'http://iiif.io/api/presentation/2.1/context.json': '2.1'
      };
      return versionMap[this.jsonLd['@context']];
    },
    getManifestUris: function() {
      if (this.jsonLd.manifests) {
        return jQuery.map(this.jsonLd.manifests, function(v, _) {
          return v['@id'];
        });
      }
      if (this.jsonLd.members) {
        return jQuery.map(this.jsonLd.members, function(v, _) {
          if (v['@type'] === 'sc:Manifest') {
            return v['@id'];
          }
        });
      }
      return [];
    },
    getManifestBlocks: function() {
      if (this.jsonLd.manifests) {
        return this.jsonLd.manifests;
      }
      if (this.jsonLd.members) {
        return jQuery.map(this.jsonLd.members, function(v, _) {
          if (v['@type'] === 'sc:Manifest') {
            return v;
          }
        });
      }
      return [];
    },
    getCollectionUris: function() {
      if (this.jsonLd.collections) {
        return jQuery.map(this.jsonLd.collections, function(v, _) {
          return v['@id'];
        });
      }
      if (this.jsonLd.members) {
        return jQuery.map(this.jsonLd.members, function(v, _) {
          if (v['@type'] === 'sc:Collection') {
            return v['@id'];
          }
        });
      }
      return [];
    },
    getCollectionBlocks: function() {
      if (this.jsonLd.collections) {
        return this.jsonLd.collections;
      }
      if (this.jsonLd.members) {
        return jQuery.map(this.jsonLd.members, function(v, _) {
          if (v['@type'] === 'sc:Collection') {
            return v;
          }
        });
      }
      return [];
    }
  };

}(Mirador));