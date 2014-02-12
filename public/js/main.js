/*
 * Application
 */
(function() {
  /*
   * Photo Object
   */
  function Photo(data) {
    this.data = data;
  };

  Photo.prototype.getTitle =
    function() {
      return this.data['title'];
    };

  Photo.prototype.getPhotoUrl =
    function() {
      return this.data['url_m'];
    }

  Photo.prototype.getThumbnailUrl =
    function() {
      return this.data['url_t'];
    };

  /*
   * Photoset Object
   */
  function Photoset(id) {
    this.id = id;
    this.title = '';
    this.photos = [];
    this.cursor = 0;
  };

  Photoset.prototype.getTitle =
    function() {
      return this.title;
    };

  Photoset.prototype.incrementCursor =
    function(increment) {
      if(!isNaN(Number(increment))) {
        var temp = this.cursor + increment;

        // bounds checking
        if(temp >= this.photos.length) {
          this.cursor = 0;
        } else if(temp < 0) {
          this.cursor =
            this.photos.length - 1;
        } else {
          this.cursor = temp;
        }
      }
    };

  Photoset.prototype.getCurrentPhoto =
    function() {
      return this.photos[
        this.cursor
      ];
    };

  Photoset.prototype.retrievePhotos =
    function() {
      var self = this,
          id = this.id;

      return flickerAPI.retrievePhotoset(id)
        .done(function(data) {
          if(data['stat'] !== 'ok') {
            self.title =
              'photoset could not be loaded';
            return;
          }

          var photoset = data['photoset'],
              photos = photoset['photo'],
              title = self.title =
                photoset['title'];
          for(var p in photos) {
            self.photos.push(
              new Photo(photos[p])
            );
          }
        })
        .fail(function() {
          self.title =
            'photoset could not be loaded';
        });
    };

  function PhotoViewer(photoset) {
    this.photoset = photoset;

    // dom
    this.$title1 = $('h1.title');
    this.$title2 = $('h2.title');
    this.$btns = $('.btn');
    this.$photo = $('.pane .photo');

    // events
    this.$btns.click(
      (function(self) {
        return function(e) {
          self.move.apply(self, [e]);
        }
      })(this)
    );

    this.update();
  }

  PhotoViewer.prototype.move =
    function(e) {
      var el = e.currentTarget,
          photoset = this.photoset;
      switch(el.className) {
        case 'btn left':
          photoset.incrementCursor(-1);
          break;
        case 'btn right':
          photoset.incrementCursor(1);
          break;
      }
      this.update();
    }

  PhotoViewer.prototype.update =
    function() {
      var photoset = this.photoset,
          photo = photoset.getCurrentPhoto();
      
      // update photoset
      // title
      this.$title1.html(
        photoset.getTitle()
      ); 

      // update photo
      // title
      this.$title2.html(
        photo.getTitle()
      );

      // update photo
      // pane
      this.$photo.css(
        'backgroundImage',
          'url("' + photo.getPhotoUrl() + '")'
      );
    };

  /*
   * Flickr API singleton
   */
  var flickerAPI = new function() {
      var config = {
        url: 'http://api.flickr.com/services/rest/',
        data: {
          format: 'json',
          api_key: '8765c822afca72cde234950a38901530',
          nojsoncallback: '1'
        }
      };

      this.retrievePhotoset = function(id) {
        var data = config['data'];
            data['photoset_id'] = id;
            data['method'] = 'flickr.photosets.getPhotos';
            data['extras'] = 'url_m,url_t';

        return $.ajax(config['url'], {
          accepts: 'application/json',
          async: true,
          cache: false,
          crossDomain: true,
          data: data
        });
      }
  };

  /*
   * Bootstrap Application
   */
  $(document).ready(function() {
    var photoset = new Photoset('72157635708954613');
        photoset.retrievePhotos()
          .done(function() {
            new PhotoViewer(photoset);
          });
  });    
})();