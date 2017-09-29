// ==UserScript==
// @name         Starve.io Sprites
// @namespace    https://github.com/jasonkhanlar/starve-io-extensions
// @version      0.16.0
// @description  Show Starve.io Sprites
// @author       Jason Khanlar
// @match        http://starve.io/
// @grant        none
// ==/UserScript==

// This script requires a 'Starve.io Deobfuscate' script as a dependency

(function() {
    'use strict';

    var required_deobfuscate_version = '0.16.0';

    function checkDependencies() {
        if (typeof deobauto === 'undefined') {
            // 'Starve.io Deobfuscated' is required as a dependency
            setTimeout(checkDependencies, 50);
        } else if (deobauto === true || deobauto < required_deobfuscate_version) {
            alert('deobfuscate userscript v' + required_deobfuscate_version + ' or higher is required.');
        } else {
            // Dependency satisfied
            main();
        }
    }

    // http://werxltd.com/wp/2010/05/13/javascript-implementation-of-javas-string-hashcode-method/
    String.prototype.hashCode = function() {
        var hash = 0;
        if (this.length === 0) return hash;
        for (i=0; i<this.length; i++) {
            var char = this.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return hash;
    }

    var img_data = [], imgs = [];

    function add_image(x, elem) {
        if (elem.tagName === 'CANVAS') { elem = CTI(elem); }
        var hash = elem.src.hashCode();

        if (img_data[hash] === void 0) {
            img_data[hash] = x;
            imgs.push(elem);
            return true;
        } else {
            imgs.push(document.createTextNode('Duplicate of ' + img_data[hash]));
            return imgs.length - 1;
        }
    }

    function loading(x) {
        console.log('Loading: ' + Math.round(x / sprite.length * 100) + '%');
    }

    function main() {
        var html_table = document.createElement('table'),
        html_tbody = document.createElement('tbody'),
        html_td_linenum,
        html_td_images,
        is_image;

        for (var x=0; x<sprite.length; x++) {
            if (typeof sprite[x] === 'undefined') continue;

            var html_tr = document.createElement('tr');
            imgs = [];
             if (Array.isArray(sprite[x])) {
                for (var y=0; y<sprite[x].length; y++) {
                    if (Array.isArray(sprite[x][y])) {
                        for (var z=0; z<sprite[x][y].length; z++) {
                            if (sprite[x][y][z].tagName === 'CANVAS' || sprite[x][y][z].tagName === 'IMG') {
                                is_image = add_image(x, sprite[x][y][z]);
                            }
                        }
                    } else if (sprite[x][y].tagName === 'CANVAS' || sprite[x][y].tagName === 'IMG') {
                        is_image = add_image(x, sprite[x][y]);
                    }
                }
            } else if (sprite[x].tagName === 'CANVAS' || sprite[x].tagName === 'IMG') {
                is_image = add_image(x, sprite[x]);
            }

            html_td_linenum = document.createElement('td');
            html_td_linenum.textContent = x;

            html_td_images = document.createElement('td');

            for (var y=0; y<imgs.length; y++) {
                if (is_image === true || is_image === y) {
                    html_td_images.appendChild(imgs[y]);
                }
            }

            html_tr.appendChild(html_td_linenum);
            html_tr.appendChild(html_td_images);
            // For some reason many sprites do not process correctly in Chrome, use id for 2nd pass
            html_tr.id = 'sprite_row_'+x;
            html_tbody.appendChild(html_tr);
            loading(x);
        }

        html_table.appendChild(html_tbody);
        document.body.innerHTML = '';
        document.body.style.backgroundColor = '#808080';
        document.body.appendChild(html_table);
        document.body.style.overflow = 'scroll';
    }

    checkDependencies();
})();