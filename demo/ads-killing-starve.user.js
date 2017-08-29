// ==UserScript==
// @name         Starve.io Demo: Adblockers kill Starve.io, Disable your ad blockers and use ad enablers
// @namespace    http://tampermonkey.net/
// @version      0.15.1
// @description  Demo showing use of ad enablers
// @author       Jason Khanlar
// @match        http://starve.io/
// @grant        none
// ==/UserScript==

// This script requires a 'Starve.io Deobfuscate' script as a dependency

(function() {
    'use strict';

    function checkDependencies() {
        if ((typeof deobauto === 'undefined' || deobauto !== true)) {
            // 'Starve.io Deobfuscated' is required as a dependency
            setTimeout(checkDependencies, 50);
        } else {
            // Dependency satisfied
            main();
        }
    }

    window.ad_data = {
        imgs: [
        ],
        urls: [
            'https://s3.fightforthefuture.org/img/page/homepage/logo.png',
            'https://www.battleforthenet.com/images/banner2.jpg',
            'https://www.battleforthenet.com/images/internet-weird.png',
            'https://www.battleforthenet.com/images/july12/01.jpg',
            'https://www.battleforthenet.com/images/july12/02.jpg',
            'https://www.battleforthenet.com/images/july12/03.jpg',
            'https://www.battleforthenet.com/images/july12/04.jpg',
            'https://www.battleforthenet.com/images/logos/18mr.png',
            'https://www.battleforthenet.com/images/logos/aall.png',
            'https://www.battleforthenet.com/images/logos/accessnow.png',
            'https://www.battleforthenet.com/images/logos/aclu.jpg',
            'https://www.battleforthenet.com/images/logos/acquia-revised.jpg',
            'https://www.battleforthenet.com/images/logos/actionnetwork.png',
            'https://www.battleforthenet.com/images/logos/adafruit.jpg',
            'https://www.battleforthenet.com/images/logos/adblock plus.png',
            'https://www.battleforthenet.com/images/logos/adblock.png',
            'https://www.battleforthenet.com/images/logos/airbnb.png',
            'https://www.battleforthenet.com/images/logos/ala.jpg',
            'https://www.battleforthenet.com/images/logos/alliedforstartups.png',
            'https://www.battleforthenet.com/images/logos/anchorfree.png',
            'https://www.battleforthenet.com/images/logos/apalon.jpg',
            'https://www.battleforthenet.com/images/logos/arl.png',
            'https://www.battleforthenet.com/images/logos/ASBC.jpg',
            'https://www.battleforthenet.com/images/logos/ask.jpg',
            'https://www.battleforthenet.com/images/logos/atlassian.png',
            'https://www.battleforthenet.com/images/logos/authorsguild.jpg',
            'https://www.battleforthenet.com/images/logos/automattic.png',
            'https://www.battleforthenet.com/images/logos/badgeRGB.png',
            'https://www.battleforthenet.com/images/logos/bandcamp-logotype-color-128.png',
            'https://www.battleforthenet.com/images/logos/bestVPN.png',
            'https://www.battleforthenet.com/images/logos/bigchain.png',
            'https://www.battleforthenet.com/images/logos/bitbucket.png',
            'https://www.battleforthenet.com/images/logos/bittorrent.png',
            'https://www.battleforthenet.com/images/logos/bloodydisgusting.png',
            'https://www.battleforthenet.com/images/logos/boingboing.png',
            'https://www.battleforthenet.com/images/logos/brave.png',
            'https://www.battleforthenet.com/images/logos/burlingtontelecom.png',
            'https://www.battleforthenet.com/images/logos/cashmusic.png',
            'https://www.battleforthenet.com/images/logos/ccia.png',
            'https://www.battleforthenet.com/images/logos/ccmixter.png',
            'https://www.battleforthenet.com/images/logos/cdt-revised.png',
            'https://www.battleforthenet.com/images/logos/centerformediajustice.png',
            'https://www.battleforthenet.com/images/logos/changeorg.png',
            'https://www.battleforthenet.com/images/logos/checkiday.png',
            'https://www.battleforthenet.com/images/logos/checkout.jpg',
            'https://www.battleforthenet.com/images/logos/chess.png',
            'https://www.battleforthenet.com/images/logos/civicrm.png',
            'https://www.battleforthenet.com/images/logos/codeacademy.png',
            'https://www.battleforthenet.com/images/logos/collegehumor.png',
            'https://www.battleforthenet.com/images/logos/colorofchange.jpg',
            'https://www.battleforthenet.com/images/logos/commoncause.png',
            'https://www.battleforthenet.com/images/logos/consumerreports.png',
            'https://www.battleforthenet.com/images/logos/cos.png',
            'https://www.battleforthenet.com/images/logos/Coworker.org_Logo1-400x250.png',
            'https://www.battleforthenet.com/images/logos/creativecommons.png',
            'https://www.battleforthenet.com/images/logos/credo.png',
            'https://www.battleforthenet.com/images/logos/dailykos.png',
            'https://www.battleforthenet.com/images/logos/demandprogress.png',
            'https://www.battleforthenet.com/images/logos/deviantart.png',
            'https://www.battleforthenet.com/images/logos/DFA-Logo-bottom-transparent-400.png',
            'https://www.battleforthenet.com/images/logos/digitalocean.png',
            'https://www.battleforthenet.com/images/logos/digitalwest.png',
            'https://www.battleforthenet.com/images/logos/discord.png',
            'https://www.battleforthenet.com/images/logos/Discourse.png',
            'https://www.battleforthenet.com/images/logos/download.png',
            'https://www.battleforthenet.com/images/logos/dreadcentral.png',
            'https://www.battleforthenet.com/images/logos/DreamHost.png',
            'https://www.battleforthenet.com/images/logos/dribbble.png',
            'https://www.battleforthenet.com/images/logos/dropbox.png',
            'https://www.battleforthenet.com/images/logos/duckduckgo.png',
            'https://www.battleforthenet.com/images/logos/eff-logo-plain-rgb.png',
            'https://www.battleforthenet.com/images/logos/elastic.png',
            'https://www.battleforthenet.com/images/logos/engine.png',
            'https://www.battleforthenet.com/images/logos/ETHnews.png',
            'https://www.battleforthenet.com/images/logos/Etsy_logo-correct.png',
            'https://www.battleforthenet.com/images/logos/evrybit.jpg',
            'https://www.battleforthenet.com/images/logos/expative.png',
            'https://www.battleforthenet.com/images/logos/expertsexchange.png',
            'https://www.battleforthenet.com/images/logos/FaithfulInternet.png',
            'https://www.battleforthenet.com/images/logos/fark.png',
            'https://www.battleforthenet.com/images/logos/FiftyThree.png',
            'https://www.battleforthenet.com/images/logos/flashrouters.png',
            'https://www.battleforthenet.com/images/logos/Foursquare.png',
            'https://www.battleforthenet.com/images/logos/freecodecamp.png',
            'https://www.battleforthenet.com/images/logos/freemusic.png',
            'https://www.battleforthenet.com/images/logos/freepressactionfund.png',
            'https://www.battleforthenet.com/images/logos/freesoftwarefoundation.png',
            'https://www.battleforthenet.com/images/logos/funnyordie.png',
            'https://www.battleforthenet.com/images/logos/fuzzco.png',
            'https://www.battleforthenet.com/images/logos/genjustice.jpg',
            'https://www.battleforthenet.com/images/logos/github.png',
            'https://www.battleforthenet.com/images/logos/gnsltd.png',
            'https://www.battleforthenet.com/images/logos/greenpeace.png',
            'https://www.battleforthenet.com/images/logos/heartmob.png',
            'https://www.battleforthenet.com/images/logos/hightimes.jpg',
            'https://www.battleforthenet.com/images/logos/hollaback.png',
            'https://www.battleforthenet.com/images/logos/hpa-retro-hirez.png',
            'https://www.battleforthenet.com/images/logos/hrw.png',
            'https://www.battleforthenet.com/images/logos/i2coalition.png',
            'https://www.battleforthenet.com/images/logos/iac.png',
            'https://www.battleforthenet.com/images/logos/icg-logo.png',
            'https://www.battleforthenet.com/images/logos/ifixit.png',
            'https://www.battleforthenet.com/images/logos/imgur.png',
            'https://www.battleforthenet.com/images/logos/incompas.jpg',
            'https://www.battleforthenet.com/images/logos/InternetArchive.png',
            'https://www.battleforthenet.com/images/logos/ipdb-revised.png',
            'https://www.battleforthenet.com/images/logos/IPFS.png',
            'https://www.battleforthenet.com/images/logos/ipvanish.png',
            'https://www.battleforthenet.com/images/logos/jamendo.png',
            'https://www.battleforthenet.com/images/logos/jwplayer.png',
            'https://www.battleforthenet.com/images/logos/kickstarter-logo-light.png',
            'https://www.battleforthenet.com/images/logos/kinkdotcom.png',
            'https://www.battleforthenet.com/images/logos/kip.png',
            'https://www.battleforthenet.com/images/logos/konf.png',
            'https://www.battleforthenet.com/images/logos/libertyvps.png',
            'https://www.battleforthenet.com/images/logos/linode.png',
            'https://www.battleforthenet.com/images/logos/logo.png',
            'https://www.battleforthenet.com/images/logos/lookfar.png',
            'https://www.battleforthenet.com/images/logos/magnetic.jpg',
            'https://www.battleforthenet.com/images/logos/manyvids.png',
            'https://www.battleforthenet.com/images/logos/march4nn.png',
            'https://www.battleforthenet.com/images/logos/mediaalliance.png',
            'https://www.battleforthenet.com/images/logos/mediamobilizingproject.jpg',
            'https://www.battleforthenet.com/images/logos/medium-revised2.png',
            'https://www.battleforthenet.com/images/logos/metalsucks.png',
            'https://www.battleforthenet.com/images/logos/michaeltrimm.jpg',
            'https://www.battleforthenet.com/images/logos/mightyai.png',
            'https://www.battleforthenet.com/images/logos/minds.png',
            'https://www.battleforthenet.com/images/logos/mitu.png',
            'https://www.battleforthenet.com/images/logos/momsrising.jpg',
            'https://www.battleforthenet.com/images/logos/moveon.png',
            'https://www.battleforthenet.com/images/logos/mozilla.png',
            'https://www.battleforthenet.com/images/logos/mpower.png',
            'https://www.battleforthenet.com/images/logos/msa_logo.png',
            'https://www.battleforthenet.com/images/logos/namecheap.png',
            'https://www.battleforthenet.com/images/logos/NARAL.png',
            'https://www.battleforthenet.com/images/logos/ncac.jpg',
            'https://www.battleforthenet.com/images/logos/NDIA.png',
            'https://www.battleforthenet.com/images/logos/netflix.jpg',
            'https://www.battleforthenet.com/images/logos/newgrounds.gif',
            'https://www.battleforthenet.com/images/logos/new-mode.jpg',
            'https://www.battleforthenet.com/images/logos/Nextdoor.png',
            'https://www.battleforthenet.com/images/logos/nhmc.png',
            'https://www.battleforthenet.com/images/logos/noiseaware.png',
            'https://www.battleforthenet.com/images/logos/ofa.png',
            'https://www.battleforthenet.com/images/logos/okcupid.png',
            'https://www.battleforthenet.com/images/logos/opendemocracy.jpg',
            'https://www.battleforthenet.com/images/logos/openmedia.png',
            'https://www.battleforthenet.com/images/logos/opensourceinitiative.png',
            'https://www.battleforthenet.com/images/logos/opentechnology.png',
            'https://www.battleforthenet.com/images/logos/opera.png',
            'https://www.battleforthenet.com/images/logos/oreilly.png',
            'https://www.battleforthenet.com/images/logos/osi.png',
            'https://www.battleforthenet.com/images/logos/other98.png',
            'https://www.battleforthenet.com/images/logos/ourrevolution.png',
            'https://www.battleforthenet.com/images/logos/palantir.png',
            'https://www.battleforthenet.com/images/logos/pantheon.png',
            'https://www.battleforthenet.com/images/logos/patook.png',
            'https://www.battleforthenet.com/images/logos/patreon.png',
            'https://www.battleforthenet.com/images/logos/PCCC-Standard-HiRes-Logo-RGB.jpg',
            'https://www.battleforthenet.com/images/logos/pilot.png',
            'https://www.battleforthenet.com/images/logos/playstv.png',
            'https://www.battleforthenet.com/images/logos/plos.png',
            'https://www.battleforthenet.com/images/logos/pluralsight.png',
            'https://www.battleforthenet.com/images/logos/PopResbanner.PNG',
            'https://www.battleforthenet.com/images/logos/priceonomics.png',
            'https://www.battleforthenet.com/images/logos/privacy tools logo.png',
            'https://www.battleforthenet.com/images/logos/privateinternetaccess.png',
            'https://www.battleforthenet.com/images/logos/protonmail.png',
            'https://www.battleforthenet.com/images/logos/publicknowledge.png',
            'https://www.battleforthenet.com/images/logos/raceforward.png',
            'https://www.battleforthenet.com/images/logos/ran.jpg',
            'https://www.battleforthenet.com/images/logos/reddit.png',
            'https://www.battleforthenet.com/images/logos/redfin.png',
            'https://www.battleforthenet.com/images/logos/renttherunway.png',
            'https://www.battleforthenet.com/images/logos/rockthevote.png',
            'https://www.battleforthenet.com/images/logos/shapeways.png',
            'https://www.battleforthenet.com/images/logos/simpleinout.png',
            'https://www.battleforthenet.com/images/logos/singlemusic.png',
            'https://www.battleforthenet.com/images/logos/slashdot.jpg',
            'https://www.battleforthenet.com/images/logos/slickdeals.png',
            'https://www.battleforthenet.com/images/logos/slimware.jpg',
            'https://www.battleforthenet.com/images/logos/songmeanings-revised.png',
            'https://www.battleforthenet.com/images/logos/sonic-replace.png',
            'https://www.battleforthenet.com/images/logos/sonos.png',
            'https://www.battleforthenet.com/images/logos/soundcloud.png',
            'https://www.battleforthenet.com/images/logos/sourceforge.jpg',
            'https://www.battleforthenet.com/images/logos/sovrn.png',
            'https://www.battleforthenet.com/images/logos/spotify.png',
            'https://www.battleforthenet.com/images/logos/stackoverflow.png',
            'https://www.battleforthenet.com/images/logos/startmail.png',
            'https://www.battleforthenet.com/images/logos/startpage.png',
            'https://www.battleforthenet.com/images/logos/surfeasy.png',
            'https://www.battleforthenet.com/images/logos/tanaza.png',
            'https://www.battleforthenet.com/images/logos/tastemade.png',
            'https://www.battleforthenet.com/images/logos/teamsnap.png',
            'https://www.battleforthenet.com/images/logos/techgage.png',
            'https://www.battleforthenet.com/images/logos/technyc.png',
            'https://www.battleforthenet.com/images/logos/thatoneprivacysite.jpg',
            'https://www.battleforthenet.com/images/logos/thenation.jpg',
            'https://www.battleforthenet.com/images/logos/thinkgeek.jpg',
            'https://www.battleforthenet.com/images/logos/ting-revised.png',
            'https://www.battleforthenet.com/images/logos/top10vpn.png',
            'https://www.battleforthenet.com/images/logos/trello-logo.png',
            'https://www.battleforthenet.com/images/logos/truthdig.png',
            'https://www.battleforthenet.com/images/logos/tumblr.png',
            'https://www.battleforthenet.com/images/logos/tunnelbear.png',
            'https://www.battleforthenet.com/images/logos/twilio.png',
            'https://www.battleforthenet.com/images/logos/urbandictionary.jpg',
            'https://www.battleforthenet.com/images/logos/USDAC.jpg',
            'https://www.battleforthenet.com/images/logos/usv.png',
            'https://www.battleforthenet.com/images/logos/venturebeat.png',
            'https://www.battleforthenet.com/images/logos/viceimpact.png',
            'https://www.battleforthenet.com/images/logos/vidme.png',
            'https://www.battleforthenet.com/images/logos/vimeo.png',
            'https://www.battleforthenet.com/images/logos/vivaldi.png',
            'https://www.battleforthenet.com/images/logos/voqal.jpg',
            'https://www.battleforthenet.com/images/logos/vyprvpn.png',
            'https://www.battleforthenet.com/images/logos/wakatime.png',
            'https://www.battleforthenet.com/images/logos/wanderu.png',
            'https://www.battleforthenet.com/images/logos/weebly.png',
            'https://www.battleforthenet.com/images/logos/wgae.jpg',
            'https://www.battleforthenet.com/images/logos/wgaw.jpg',
            'https://www.battleforthenet.com/images/logos/witness.jpg',
            'https://www.battleforthenet.com/images/logos/womensmarch.png',
            'https://www.battleforthenet.com/images/logos/WordMark150x40PuntRoad.png',
            'https://www.battleforthenet.com/images/logos/workingnarratives.png',
            'https://www.battleforthenet.com/images/logos/worldwidewebfoundation.jpg',
            'https://www.battleforthenet.com/images/logos/ycombinator.png',
            'https://www.battleforthenet.com/images/logos/yelp.png',
            'https://www.battleforthenet.com/images/logos/zapier.png',
            'https://www.battleforthenet.com/images/logos/zenmate.png',
            'https://www.battleforthenet.com/images/tools/push.png'
        ]
    };

    function main() {
        DIE = 'Thank you so much for using an ad enabler!;'.repeat(DIE.length).split(';');
        DIE[DIE.length - 1] = undefined;

        for (var x=0; x<ad_data.urls.length; x++) {
            ad_data.imgs[x] = document.createElement('img');
            ad_data.imgs[x].src = ad_data.urls[x];
        }

        window.old_draw_player = window[draw_player];
        window[draw_player] = function(c, g) {
            old_draw_player.apply(this, arguments);
            if (this.pid !== user.id) {
                this.angle -= Math.PI / 2;
                draw_ad.apply(this, arguments);
                this.angle += Math.PI / 2;
            }
        };
        window.old_draw_simple_mobs = window[draw_simple_mobs];
        window[draw_simple_mobs] = function(c, g) { draw_ad.apply(this, arguments); };
        window.old_draw_simple_mobs_2 = window[draw_simple_mobs_2];
        window[draw_simple_mobs_2] = function(c, g) { draw_ad.apply(this, arguments); };

        window.ext_video = document.createElement('video');
        var ext_source = document.createElement('source');
        ext_video.autoplay = true;
        ext_video.controls = true;
        ext_video.id = 'ext_video';
        ext_video.loop = true;
        ext_video.muted = true;
        ext_video.style.display = 'none';
        ext_video.volume = 0.25;
        // Temporary 6 hour expiring link for https://vimeo.com/223515967 (Battle For The Net Video Bumper)
        ext_source.src = 'https://r11---sn-p5qlsn6l.googlevideo.com/videoplayback?requiressl=yes&ei=VU-lWYLKKsig8wSjz5HIBg&source=youtube&initcwndbps=1607500&ipbits=0&sparams=dur%2Cei%2Cid%2Cinitcwndbps%2Cip%2Cipbits%2Citag%2Clmt%2Cmime%2Cmm%2Cmn%2Cms%2Cmv%2Cpl%2Cratebypass%2Crequiressl%2Csource%2Cexpire&lmt=1499853301378105&mime=video%2Fmp4&id=o-AByQEmAsISJdinoa39CYZUhe04__7t2UkvPnIUMaRLUt&signature=87C64549A2FA02311D56A519A3AACD889B1286BB.4FDE765D217CD68801C83420CDC113BA1921D433&ms=au&mt=1504005889&itag=22&mv=m&dur=34.040&expire=1504027573&pl=26&ip=2601%3A547%3A1300%3A6c66%3A192f%3Ab408%3A7ca4%3Aaafa&mm=31&mn=sn-p5qlsn6l&ratebypass=yes&key=yt6';
        ext_source.type = 'video/mp4';
        ext_video.appendChild(ext_source);
        document.body.append(ext_video);
        ctx.drawImage(ext_video, 5, 5, 320, 180);
    }

    window.draw_ad = function(c, g) {
        if (Math.floor(Math.random() * 2) === 0) draw_picture.apply(this, arguments);
        else draw_video.apply(this, arguments);
    };

    window.draw_picture = function(c, g) {
        ext_video.muted = false;
        ctx.save();
        ctx.translate(user.cam.x + this.x, user.cam.y + this.y);
        ctx.rotate(this.angle);
        var f = sprite[c][world.time];
        w = -f.width;
        h = -f.height;
        ctx.drawImage(ad_data.imgs[Math.floor(Math.random()*ad_data.imgs.length)], -w/2, -h/2, w, h);
        if (this.action & O_O156640_0.HURT) {
            if (this.hit.update() && 0 === this.hit.o) {
                this.action -= O_O156640_0.HURT;
            }
            ctx.globalAlpha = 0.6 - this.hit.v;
            f = sprite[g];
            ctx.drawImage(ad_data.imgs[Math.floor(Math.random()*ad_data.imgs.length)], -w/2, -h/2, w, h);
            ctx.globalAlpha = 1;
        }
        ctx.restore();
    };

    window.draw_video = function(c, g) {
        ext_video.muted = false;
        ctx.save();
        ctx.translate(user.cam.x + this.x, user.cam.y + this.y);
        ctx.rotate(this.angle);
        var f = sprite[c][world.time];
        w = -f.width;
        h = -f.height;
        ctx.drawImage(ext_video, -w/2, -h/2, w, h);
        if (this.action & O_O156640_0.HURT) {
            if (this.hit.update() && 0 === this.hit.o) {
                this.action -= O_O156640_0.HURT;
            }
            ctx.globalAlpha = 0.6 - this.hit.v;
            f = sprite[g];
            ctx.drawImage(ext_video, -w/2, -h/2, w, h);
            ctx.globalAlpha = 1;
        }
        ctx.restore();
    };

    checkDependencies();
})();