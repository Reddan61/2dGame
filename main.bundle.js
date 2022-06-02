(()=>{"use strict";var t=[(t,e,s)=>{Object.defineProperty(e,"__esModule",{value:!0}),e.EnemyController=void 0;const i=s(2);class n{static draw(t,e,s){for(let s=0;s<n.EnemyArray.length;s++)n.EnemyArray[s].draw(t,e);for(let s=0;s<n.EnemySpawnPoints.length;s++)n.EnemySpawnPoints[s].draw(t,e)}static checkTrigger(t,e,s){const i=Math.floor(t.X/e.TILESIZE),h=Math.floor(t.Y/e.TILESIZE),o=s.triggerEnemyTilesX,r=s.triggerEnemyTilesY;for(let t=0;t<n.EnemyArray.length;t++){const s=Math.floor(n.EnemyArray[t].X/e.TILESIZE),a=Math.floor(n.EnemyArray[t].Y/e.TILESIZE),l=Math.sqrt(Math.pow(s-i,2)+Math.pow(a-h,2));(l<=o||l<=r)&&(n.EnemyArray[t].triggered=!0)}}static spawnEnemyInSpawnPoint(t){for(let e=0;e<n.EnemySpawnPoints.length;e++){const s=n.EnemySpawnPoints[e];let i=!0;for(let e=0;e<n.EnemyArray.length;e++){const h=n.EnemyArray[e];if(s.checkCollision(h.X,h.Y,h.RADIUS,t)){i=!1;break}}if(i){const t=s.spawn();t&&n.EnemyArray.push(t)}}}static spawnSingleEnemy(t,e,s,h,o,r,a=100){n.EnemyArray.push(new i.Enemy(t,e,s,h,o,r,a))}static setSpawnPoints(t){n.EnemySpawnPoints=[...t]}static findPath(t,e,s,i,h){for(let o=0;o<n.EnemyArray.length;o++)n.EnemyArray[o].findPath(t,e,s,i,h)}static enemyAttack(t){n.EnemyArray.forEach((e=>{Math.sqrt(Math.pow(t.X-e.X,2)+Math.pow(t.Y-e.Y,2))<=t.RADIUS+2*e.RADIUS&&e.attack(t)}))}static collisionEnemyForPlayer(t,e,s,i,h){let o=!1;for(let r=0;r<n.EnemyArray.length;r++){if(n.EnemyArray[r].X===t&&n.EnemyArray[r].Y===e)continue;const a=n.EnemyArray[r];if(s-h<a.X+a.RADIUS/2&&s+h>a.X-a.RADIUS/2&&i-h<a.Y+a.RADIUS/2&&i+h>a.Y-a.RADIUS/2&&(o=!0,o))break}return o}static bulletCollisionEnemy(t,e,s,i,h,o){let r=!1;for(let a=0;a<n.EnemyArray.length;a++){const l=n.EnemyArray[a];if(t-s<l.X+l.RADIUS&&t+s>l.X-l.RADIUS&&e-s<l.Y+l.RADIUS&&e+s>l.Y-l.RADIUS&&(r=!0,n.EnemyArray[a].isDead(i.DAMAGE)&&(n.EnemyArray[a].whenDead(o,h),n.EnemyArray.splice(a,1)),r))break}return r}static getPositionOtherEnemies(t){const e=[];for(let s=0;s<n.EnemyArray.length;s++)t.X===n.EnemyArray[s].X&&t.Y===n.EnemyArray[s].Y||e.push(`${Math.floor(n.EnemyArray[s].X/100)},${Math.floor(n.EnemyArray[s].Y/100)}`);return e}static getPositionEnemies(){const t=[];for(let e=0;e<n.EnemyArray.length;e++)t.push(`${Math.floor(n.EnemyArray[e].X/100)},${Math.floor(n.EnemyArray[e].Y/100)}`);return t}}e.EnemyController=n,n.EnemyArray=[],n.EnemySpawnPoints=[]},function(t,e,s){var i=this&&this.__importDefault||function(t){return t&&t.__esModule?t:{default:t}};Object.defineProperty(e,"__esModule",{value:!0});const n=s(0);s(14);const h=i(s(15)),o=s(12),r=s(17),a=s(19),l=s(20),c=s(21),u=s(22),p=s(23),m=i(s(24));let f=0,d=0,E=0;const y=document.getElementById("canvas");y.width=window.innerWidth,y.height=window.innerHeight;const P=y.getContext("2d");let g=new r.GameMap(100),S=new a.Camera(0,0,y.width,y.height),A=new l.Weapon(20,25,5,10,.1),T=new c.Player(0,0,30,"blue",5,A);function I(){g=new r.GameMap(100),S=new a.Camera(0,0,y.width,y.height),A=new l.Weapon(20,25,5,10,.1),T=new c.Player(0,0,30,"blue",5,A),n.EnemyController.EnemyArray.splice(0,n.EnemyController.EnemyArray.length),o.BulletsController.bullets.splice(0,o.BulletsController.bullets.length),g.convertTextMapToWorldMap(T),S.setPosition(T.X,T.Y),b()}g.convertTextMapToWorldMap(T),S.setPosition(T.X,T.Y);const b=()=>{if(!P)return;if(P.clearRect(0,0,y.offsetWidth,y.offsetHeight),T.health<=0)return void I();const t=Math.floor(performance.now()/1e3);E!=t?(d=f,f=0,E=t):f++,T.movement(g),S.setPosition(T.X,T.Y),T.checkChunk(g),T.shoot(),g.renderMap(P,S,u.configGlobalKeys),n.EnemyController.spawnEnemyInSpawnPoint(g),n.EnemyController.checkTrigger(T,g,p.config),n.EnemyController.findPath(T,g,P,S,u.configGlobalKeys),n.EnemyController.draw(P,S,g),n.EnemyController.enemyAttack(T),o.BulletsController.moveBullets(T,g),o.BulletsController.drawBullets(P,S),T.draw(P,S),(0,h.default)(P,d),(0,m.default)(P),requestAnimationFrame(b)};document.addEventListener("keydown",(t=>{T.setPressedKey(t.code),u.configGlobalKeys[t.code]=!u.configGlobalKeys[t.code],"KeyR"===t.code&&I()})),document.addEventListener("keyup",(t=>{T.setunPressedKey(t.code)})),document.addEventListener("mousedown",(t=>{T.setPressedKey(String(t.button))})),document.addEventListener("mouseup",(t=>{T.setunPressedKey(String(t.button))})),document.addEventListener("wheel",(t=>{t.deltaY>0?S.zoom(1):S.zoom(-1)})),y.addEventListener("mousemove",(t=>{const e=y.getBoundingClientRect(),s=e.left,i=e.top;T.setAngle(t.clientX-s,t.clientY-i,S)})),b()},(t,e,s)=>{Object.defineProperty(e,"__esModule",{value:!0}),e.Enemy=void 0;const i=s(0),n=s(3);e.Enemy=class{constructor(t,e,s,i,n,h,o=100){this.ANGLE=0,this.nearportals=[],this.triggered=!1,this.lastPositionTile="",this.lastPositionChunk="",this.findpathParts={start:"",end:"",lastEndChunk:"",pathPortals:[],pathToPortal:[],convertedPath:[]},this.lastAtack=0,this.attackSpeed=1,this.X=t,this.Y=e,this.RADIUS=s,this.COLOR=i,this.SPEED=n,this.MAXHEALTH=o,this.HEALTH=this.MAXHEALTH,this.DAMAGE=h}setPosition(t,e){this.X=t,this.Y=e}isDead(t){return this.HEALTH-=t,this.HEALTH<=0}attack(t){const e=performance.now()/1e3;this.attackSpeed+this.lastAtack<=e&&(t.getDamage(this.DAMAGE),this.lastAtack=e)}moveTo(t,e){this.ANGLE=Math.atan2(e-this.Y,t-this.X);const s=Math.cos(this.ANGLE),i=Math.sin(this.ANGLE);this.setPosition(this.X+this.SPEED*s,this.Y+this.SPEED*i)}draw(t,e){const[s,i]=e.getCords(this.X,this.Y),n=e.getSize(this.RADIUS);t.beginPath(),t.arc(s,i,n,0,2*Math.PI,!1),t.fillStyle=this.COLOR,t.fill(),t.beginPath(),t.arc(s+n*Math.cos(this.ANGLE),i+n*Math.sin(this.ANGLE),e.getSize(3),0,2*Math.PI,!1),t.fillStyle="black",t.fill();const h=2*n*(100*this.HEALTH/this.MAXHEALTH)/100;t.beginPath(),t.lineWidth=e.getSize(2),t.strokeStyle="black",t.moveTo(s-n-e.getSize(2),i+n+e.getSize(14)),t.lineTo(s+n,i+n+e.getSize(14)),t.lineTo(s+n,i+n+e.getSize(21)),t.lineTo(s-n-e.getSize(1),i+n+e.getSize(21)),t.lineTo(s-n-e.getSize(1),i+n+e.getSize(14)),t.stroke(),t.closePath(),t.fillStyle="red",t.fillRect(s-n,i+n+e.getSize(15),h,e.getSize(5))}whenDead(t,e){const s=Math.floor(this.X/e.TILESIZE),n=Math.floor(this.Y/e.TILESIZE),h=`${s},${n}`;if(!this.nearportals.includes(this.lastPositionTile)){const o=[...i.EnemyController.getPositionOtherEnemies(this),t.getPosition(e)],r=e.setPathToPortalsFromTileOneChunk(s,n);e.deleteTileToNearPortals(h,r,o)}}checkChunk(t){const e=Math.floor(this.X/t.TILESIZE),s=Math.floor(this.Y/t.TILESIZE),n=`${e},${s}`,h=t.getChunkNumber(e,s);if(this.lastPositionTile!==`${e},${s}`){if(!this.nearportals.includes(this.lastPositionTile)){const e=i.EnemyController.getPositionOtherEnemies(this);t.deleteTileToNearPortals(this.lastPositionTile,this.nearportals,e)}this.lastPositionChunk!==h&&(this.nearportals=t.setPathToPortalsFromTileOneChunk(e,s)),this.nearportals.includes(n)||t.addNewConnectTileToNearPortals(n,this.nearportals),this.lastPositionChunk=h,this.lastPositionTile=`${e},${s}`}}findPath(t,e,s,h,o){if(!this.triggered)return;const r=Math.floor(this.X/e.TILESIZE),a=Math.floor(this.Y/e.TILESIZE),l=Math.floor(t.X/e.TILESIZE),c=Math.floor(t.Y/e.TILESIZE);if(r<0||a<0||l<0||c<0)return;const u=`${r},${a}`,p=`${l},${c}`,m=`${Math.floor(r/e.chunkW)},${Math.floor(a/e.chunkH)}`,f=i.EnemyController.getPositionOtherEnemies(this),d=Math.sqrt(Math.pow(t.X-this.X,2)+Math.pow(t.Y-this.Y,2));if(this.checkChunk(e),u===p)return void(d>this.RADIUS+t.RADIUS+this.SPEED&&this.moveTo(t.X,t.Y));if(p!==this.findpathParts.end){const t=e.portalsGraph;this.findpathParts.convertedPath=[];const[,s]=(0,n.AStar)(t,e.empty_tile,e,u,p,[]);if(this.findpathParts.pathPortals=s,this.findpathParts.pathPortals[1]===p){const t=this.findpathParts.pathPortals[1].split(",");m===e.getChunkNumber(Number(t[0]),Number(t[1]))&&this.findpathParts.pathPortals.splice(0,1)}else if(this.findpathParts.pathPortals[0]){const t=this.findpathParts.pathPortals[0].split(",");if(m===e.getChunkNumber(Number(t[0]),Number(t[1]))){const[,t]=(0,n.AStar)(e.getChunkGraph(m),e.empty_tile,e,u,this.findpathParts.pathPortals[0],[]);this.findpathParts.convertedPath=[...this.findpathParts.convertedPath,...t],this.findpathParts.pathPortals.splice(0,1)}}this.findpathParts.start=u,this.findpathParts.end=p}o.KeyI&&this.drawPath(this.findpathParts.convertedPath,e.empty_tile,e.TILESIZE,h,s);const E=this.findpathParts.start.split(","),y=e.empty_tile[Number(E[1])][Number(E[0])][0]+e.TILESIZE/2,P=e.empty_tile[Number(E[1])][Number(E[0])][1]+e.TILESIZE/2;if(!this.findpathParts.convertedPath[0]){if(this.findpathParts.pathPortals[0]){const t=this.findpathParts.pathPortals[0].split(",");if(e.getChunkNumber(Number(t[0]),Number(t[1]))!==m)return this.findpathParts.convertedPath=[...this.findpathParts.convertedPath,this.findpathParts.pathPortals[0]],void this.findpathParts.pathPortals.splice(0,1);const[,s]=(0,n.AStar)(e.getChunkGraph(m),e.empty_tile,e,u,this.findpathParts.pathPortals[0],[]);this.findpathParts.convertedPath=[...this.findpathParts.convertedPath,...s],this.findpathParts.pathPortals.splice(0,1)}return}const g=this.findpathParts.convertedPath[0].split(","),S=e.empty_tile[Number(g[1])][Number(g[0])][0]+e.TILESIZE/2,A=e.empty_tile[Number(g[1])][Number(g[0])][1]+e.TILESIZE/2,T=Math.sqrt(Math.pow(this.X-S,2)+Math.pow(this.Y-A,2)),I=Math.sqrt(Math.pow(this.X-y,2)+Math.pow(this.Y-P,2));Math.sqrt(Math.pow(S-y,2)+Math.pow(A-P,2))<T&&I>this.SPEED?this.moveTo(y,P):(f.includes(this.findpathParts.convertedPath[0])||d>this.RADIUS+t.RADIUS+this.SPEED&&this.moveTo(S,A),T<=this.SPEED&&this.findpathParts.convertedPath.splice(0,1))}drawPath(t,e,s,i,n){const[h,o]=i.getCords(this.X,this.Y),r={x:h,y:o};for(let h=0;h<t.length;h++){const o=t[h].split(","),a=e[Number(o[1])][Number(o[0])][0]+s/2,l=e[Number(o[1])][Number(o[0])][1]+s/2,[c,u]=i.getCords(a,l);n.beginPath(),n.lineWidth=i.getSize(2),n.strokeStyle="green",n.moveTo(r.x,r.y),n.lineTo(c,u),n.stroke(),r.x=c,r.y=u}}}},(t,e)=>{Object.defineProperty(e,"__esModule",{value:!0}),e.AStar=void 0,e.AStar=(t,e,s,i,n,h)=>{const o={},r=[i];let a=[...t[i]];const l={};for(let t=0;t<a.length;t++)o[a[t][0]]=d(a[t][0],a[t][1],e),l[a[t][0]]=i;let c=E(o,r),u=!1;for(;c;)if(!h.includes(c)&&t[c]){a=[...t[c]];for(let t=0;t<a.length;t++){let s=o[c]+d(a[t][0],a[t][1],e);s<(o[a[t][0]]||1/0)&&(o[a[t][0]]=s,l[a[t][0]]=c,a[t][0]===String(i)&&(l[c]=a[t][0],o[a[t][0]]=1/0))}if(c===n){u=!0;break}r.push(c),c=E(o,r)}else console.log(c),r.push(c),c=E(o,r);if(!u)return[u,[]];const p=[];let m=n,f=0;for(;f<Object.keys(l).length&&(l[m]&&p.unshift(m),m=l[m],f++,m!==i););return[u,p];function d(t,e,i){const h=t.split(","),o=n.split(","),r=i[Number(h[1])][Number(h[0])],a=i[Number(o[1])][Number(o[0])];return e+10*(Math.abs((a[0]-r[0])/s.TILESIZE)+Math.abs((a[1]-r[1])/s.TILESIZE))}function E(t,e){let s=1/0,i="";return Object.keys(t).forEach((n=>{t[n]<s&&!e.includes(n)&&(s=t[n],i=n)})),i}}},t=>{var e=[];function s(t){for(var s=-1,i=0;i<e.length;i++)if(e[i].identifier===t){s=i;break}return s}function i(t,i){for(var h={},o=[],r=0;r<t.length;r++){var a=t[r],l=i.base?a[0]+i.base:a[0],c=h[l]||0,u="".concat(l," ").concat(c);h[l]=c+1;var p=s(u),m={css:a[1],media:a[2],sourceMap:a[3],supports:a[4],layer:a[5]};if(-1!==p)e[p].references++,e[p].updater(m);else{var f=n(m,i);i.byIndex=r,e.splice(r,0,{identifier:u,updater:f,references:1})}o.push(u)}return o}function n(t,e){var s=e.domAPI(e);return s.update(t),function(e){if(e){if(e.css===t.css&&e.media===t.media&&e.sourceMap===t.sourceMap&&e.supports===t.supports&&e.layer===t.layer)return;s.update(t=e)}else s.remove()}}t.exports=function(t,n){var h=i(t=t||[],n=n||{});return function(t){t=t||[];for(var o=0;o<h.length;o++){var r=s(h[o]);e[r].references--}for(var a=i(t,n),l=0;l<h.length;l++){var c=s(h[l]);0===e[c].references&&(e[c].updater(),e.splice(c,1))}h=a}}},t=>{t.exports=function(t){var e=t.insertStyleElement(t);return{update:function(s){!function(t,e,s){var i="";s.supports&&(i+="@supports (".concat(s.supports,") {")),s.media&&(i+="@media ".concat(s.media," {"));var n=void 0!==s.layer;n&&(i+="@layer".concat(s.layer.length>0?" ".concat(s.layer):""," {")),i+=s.css,n&&(i+="}"),s.media&&(i+="}"),s.supports&&(i+="}");var h=s.sourceMap;h&&"undefined"!=typeof btoa&&(i+="\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(h))))," */")),e.styleTagTransform(i,t,e.options)}(e,t,s)},remove:function(){!function(t){if(null===t.parentNode)return!1;t.parentNode.removeChild(t)}(e)}}}},t=>{var e={};t.exports=function(t,s){var i=function(t){if(void 0===e[t]){var s=document.querySelector(t);if(window.HTMLIFrameElement&&s instanceof window.HTMLIFrameElement)try{s=s.contentDocument.head}catch(t){s=null}e[t]=s}return e[t]}(t);if(!i)throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");i.appendChild(s)}},(t,e,s)=>{t.exports=function(t){var e=s.nc;e&&t.setAttribute("nonce",e)}},t=>{t.exports=function(t){var e=document.createElement("style");return t.setAttributes(e,t.attributes),t.insert(e,t.options),e}},t=>{t.exports=function(t,e){if(e.styleSheet)e.styleSheet.cssText=t;else{for(;e.firstChild;)e.removeChild(e.firstChild);e.appendChild(document.createTextNode(t))}}},t=>{t.exports=function(t){return t[1]}},t=>{t.exports=function(t){var e=[];return e.toString=function(){return this.map((function(e){var s="",i=void 0!==e[5];return e[4]&&(s+="@supports (".concat(e[4],") {")),e[2]&&(s+="@media ".concat(e[2]," {")),i&&(s+="@layer".concat(e[5].length>0?" ".concat(e[5]):""," {")),s+=t(e),i&&(s+="}"),e[2]&&(s+="}"),e[4]&&(s+="}"),s})).join("")},e.i=function(t,s,i,n,h){"string"==typeof t&&(t=[[null,t,void 0]]);var o={};if(i)for(var r=0;r<this.length;r++){var a=this[r][0];null!=a&&(o[a]=!0)}for(var l=0;l<t.length;l++){var c=[].concat(t[l]);i&&o[c[0]]||(void 0!==h&&(void 0===c[5]||(c[1]="@layer".concat(c[5].length>0?" ".concat(c[5]):""," {").concat(c[1],"}")),c[5]=h),s&&(c[2]?(c[1]="@media ".concat(c[2]," {").concat(c[1],"}"),c[2]=s):c[2]=s),n&&(c[4]?(c[1]="@supports (".concat(c[4],") {").concat(c[1],"}"),c[4]=n):c[4]="".concat(n)),e.push(c))}},e}},(t,e,s)=>{Object.defineProperty(e,"__esModule",{value:!0}),e.BulletsController=void 0;const i=s(0),n=s(16);class h{static createNewBullet(t,e,s,i,o,r){h.bullets.push(new n.Bullet(t,e,s,i,o,r))}static drawBullets(t,e){h.bullets.forEach((s=>{s.draw(t,e)}))}static moveBullets(t,e){h.bullets.forEach(((s,n)=>{s.move(),(i.EnemyController.bulletCollisionEnemy(s.X,s.Y,s.RADIUS,s,e,t)||s.collisionWall(e))&&h.bullets.splice(n,1)}))}}e.BulletsController=h,h.bullets=[]},(t,e,s)=>{s.d(e,{a:()=>r});var i=s(10),n=s.n(i),h=s(11),o=s.n(h)()(n());o.push([t.id,"*{margin:0;padding:0;border:0}body{width:100vw;height:100vh;overflow:hidden}",""]);const r=o},(t,e,s)=>{s.r(e),s.d(e,{default:()=>y});var i=s(4),n=s.n(i),h=s(5),o=s.n(h),r=s(6),a=s.n(r),l=s(7),c=s.n(l),u=s(8),p=s.n(u),m=s(9),f=s.n(m),d=s(13),E={};E.styleTagTransform=f(),E.setAttributes=c(),E.insert=a().bind(null,"head"),E.domAPI=o(),E.insertStyleElement=p(),n()(d.a,E);const y=d.a&&d.a.locals?d.a.locals:void 0},(t,e)=>{Object.defineProperty(e,"__esModule",{value:!0}),e.default=function(t,e){t.fillStyle="#00ff4b",t.font="normal 20px Arial",t.fillText(e+" fps",10,25)}},(t,e)=>{Object.defineProperty(e,"__esModule",{value:!0}),e.Bullet=void 0,e.Bullet=class{constructor(t,e,s,i,n,h){this.X=t,this.Y=e,this.ANGLE=i,this.SPEED=s,this.RADIUS=n,this.DAMAGE=h}move(){this.X=this.X+this.SPEED*Math.cos(this.ANGLE),this.Y=this.Y+this.SPEED*Math.sin(this.ANGLE)}draw(t,e){const[s,i]=e.getCords(this.X,this.Y),n=e.getSize(this.RADIUS);t.beginPath(),t.arc(s,i,n,0,2*Math.PI,!1),t.fillStyle="rgb(199, 209, 7)",t.fill()}collisionWall(t){return t.isCollisionWall(this.X+this.SPEED*Math.cos(this.ANGLE),this.Y+this.SPEED*Math.sin(this.ANGLE))}}},(t,e,s)=>{Object.defineProperty(e,"__esModule",{value:!0}),e.GameMap=void 0;const i=s(18),n=s(0),h=s(3);e.GameMap=class{constructor(t){this.chunkW=8,this.chunkH=8,this.text_map=[[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],[1,2,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,4,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,4,0,0,0,0,0,0,0,0,4,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,4,0,0,1],[1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,4,0,0,1],[1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,1,0,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,1,1,1,1,0,0,1],[1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1,0,0,0,4,0,0,0,1,0,0,0,1,0,0,1],[1,0,0,1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,4,0,0,0,1,0,0,0,4,0,0,0,1,0,0,0,1,0,0,1],[1,4,0,1,1,1,0,0,0,0,0,4,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,4,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1,1,1,1,1,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,1,1,1,1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1,1,1,0,1,1,1,1,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,1,0,3,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,0,1,1,0,0,1,1,1,1],[1,0,0,4,0,0,0,1,0,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,4,0,0,1],[1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,1],[1,1,1,1,1,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,1,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1,1,1,1,0,1,1,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,1],[1,0,0,4,4,0,0,0,0,0,0,0,4,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,4,0,0,0,1,0,0,0,0,0,0,1],[1,0,0,4,4,0,0,0,0,0,0,0,4,0,0,1,1,1,1,0,1,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,4,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,0,0,0,0,0,1,0,4,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]],this.wall_map=[],this.empty_tile=[],this.graph={},this.portalsGraph={},this.chunkPortals={},this.chunkGraph={},this.TILESIZE=t}convertTextMapToWorldMap(t){const e=[0,0],s=[];for(let h=0;h<this.text_map.length;h++){this.wall_map[h]=[],this.empty_tile[h]=[];for(let o=0;o<this.text_map[h].length;o++)1!==this.text_map[h][o]&&(this.empty_tile[h].push([e[0],e[1]]),this.wall_map[h].push(null)),1===this.text_map[h][o]&&(this.wall_map[h].push([e[0],e[1]]),this.empty_tile[h].push(null)),2===this.text_map[h][o]&&t.setPosition(e[0]+this.TILESIZE/2,e[1]+this.TILESIZE/2),3===this.text_map[h][o]&&s.push(new i.SpawnPoint(e[0],e[1],this.TILESIZE,"rgba(227, 85, 71,0.3)",2)),4===this.text_map[h][o]&&n.EnemyController.spawnSingleEnemy(e[0],e[1],30,"red",4,15),e[0]+=this.TILESIZE;e[1]+=this.TILESIZE,e[0]=0}for(let t=0;t<this.empty_tile.length;t++)for(let e=0;e<this.empty_tile[t].length;e++){if(!this.empty_tile[t][e])continue;const s=[],i=1;this.empty_tile[t][e+1]&&s.push([`${e+1},${t}`,i]),e-1>0&&this.empty_tile[t][e-1]&&s.push([`${e-1},${t}`,i]),this.empty_tile[t+1][e]&&s.push([`${e},${t+1}`,i]),t-1>0&&this.empty_tile[t-1][e]&&s.push([`${e},${t-1}`,i]),t-1>0&&this.empty_tile[t-1][e+1]&&this.empty_tile[t-1][e]&&this.empty_tile[t][e+1]&&s.push([`${e+1},${t-1}`,i]),t-1>0&&e-1>0&&this.empty_tile[t-1][e-1]&&this.empty_tile[t-1][e]&&this.empty_tile[t][e-1]&&s.push([`${e-1},${t-1}`,i]),this.empty_tile[t+1][e+1]&&this.empty_tile[t+1][e]&&this.empty_tile[t][e+1]&&s.push([`${e+1},${t+1}`,i]),e-1>0&&this.empty_tile[t+1][e-1]&&this.empty_tile[t+1][e]&&this.empty_tile[t][e-1]&&s.push([`${e-1},${t+1}`,i]),this.graph[`${e},${t}`]=[...s]}const o=this.text_map.length/this.chunkW,r=this.text_map.length/this.chunkH,a=[[0,-1],[-1,0],[1,0],[0,1]],l=(t,e,s,i)=>{const n=Math.floor(t/this.chunkW),h=Math.floor(e/this.chunkH);this.chunkPortals[`${n},${h}`]?this.chunkPortals[`${n},${h}`].includes(`${t},${e}`)||(this.chunkPortals[`${n},${h}`]=[...this.chunkPortals[`${n},${h}`],`${t},${e}`]):this.chunkPortals[`${n},${h}`]=[`${t},${e}`],this.portalsGraph[`${t},${e}`]?this.portalsGraph[`${t},${e}`]=[...this.portalsGraph[`${t},${e}`],[`${s},${i}`,1]]:this.portalsGraph[`${t},${e}`]=[[`${s},${i}`,1]]};for(let t=0;t<o;t++)for(let e=0;e<r;e++)for(let s=e*this.chunkH;s<e*this.chunkH+this.chunkH;s++)for(let i=t*this.chunkW;i<t*this.chunkW+this.chunkW;i++)if((i===t*this.chunkW||s===e*this.chunkH||i===t*this.chunkW+this.chunkW-1||s===e*this.chunkH+this.chunkH-1)&&1!==this.text_map[s][i])for(let n=0;n<a.length;n++){const h=i+a[n][0],o=s+a[n][1];`${t},${e}`!==this.getChunkNumber(h,o)&&1!==this.text_map[o][h]&&l(i,s,h,o)}const c=Object.keys(this.chunkPortals);for(let t=0;t<c.length;t++)for(let e=0;e<this.chunkPortals[c[t]].length;e++){const s=this.chunkPortals[c[t]][e];if(this.isCurrentChunk(c[t],s))for(let i=0;i<this.chunkPortals[c[t]].length;i++){const n=this.chunkPortals[c[t]][i];if(e===i&&!this.isCurrentChunk(c[t],n))continue;const[o]=(0,h.AStar)(this.getChunkGraph(c[t]),this.empty_tile,this,s,n,[]);o&&(this.portalsGraph[s]=[...this.portalsGraph[s],[n,1]])}}n.EnemyController.setSpawnPoints(s)}addNewConnectTileToNearPortals(t,e){this.portalsGraph[t]=[];for(let s=0;s<e.length;s++)e[s]&&(this.portalsGraph[e[s]]=[...this.portalsGraph[e[s]],[t,1]],this.portalsGraph[t].push([e[s],1]))}deleteTileToNearPortals(t,e,s=[]){if(!s.includes(t)){for(let s=0;s<e.length;s++){if(!this.portalsGraph[e[s]])continue;const i=this.portalsGraph[e[s]].findIndex((e=>e[0]===t));i>=0&&this.portalsGraph[e[s]].splice(i,1)}delete this.portalsGraph[t]}}getChunkNumber(t,e){return`${Math.floor(t/this.chunkW)},${Math.floor(e/this.chunkH)}`}isCurrentChunk(t,e){const s=t.split(","),i=e.split(","),n=Number(s[0]),h=Number(s[1]),o=Number(i[0]),r=Number(i[1]),a=Math.floor(o/this.chunkW),l=Math.floor(r/this.chunkH);return n===a&&h===l}setPathToPortalsFromTileOneChunk(t,e){const s=this.getChunkNumber(t,e),i=`${t},${e}`,n=[];for(let t=0;t<this.chunkPortals[s].length;t++){const e=this.chunkPortals[s][t];if(i===e){n.push(this.chunkPortals[s][t]);continue}const[o]=(0,h.AStar)(this.getChunkGraph(s),this.empty_tile,this,i,e,[]);o&&n.push(this.chunkPortals[s][t])}return n}getChunkGraph(t){const e={},s=t.split(","),i=Number(s[0]),n=Number(s[1]),h=i*this.chunkW,o=n*this.chunkH;let r=h,a=o;if(this.chunkGraph[t])return this.chunkGraph[t];for(let t=0;t<this.chunkH;t++){a=o+t,r=h;for(let t=0;t<this.chunkW;t++){r=h+t;const s=`${r},${a}`,i=[];if(this.graph[s]&&1!==this.text_map[a][r]){for(let t=0;t<this.graph[s].length;t++){const e=this.graph[s][t][0].split(","),n=Number(e[0]),r=Number(e[1]);n<h+this.chunkW&&n>=h&&r>=o&&r<o+this.chunkH&&i.push(this.graph[s][t])}e[s]=i}}}return this.chunkGraph[t]=e,this.chunkGraph[t]}renderMap(t,e,s){const i=e.getSize(this.TILESIZE);for(let s=0;s<this.wall_map.length;s++)if(this.wall_map[s])for(let n=0;n<this.wall_map[s].length;n++){if(!this.wall_map[s][n])continue;const[h,o]=e.getCords(this.wall_map[s][n][0],this.wall_map[s][n][1]);t.beginPath(),t.fillStyle="#999999",t.fillRect(h,o,i,i),t.fill(),t.closePath()}if(s.KeyO)for(let s=0;s<this.empty_tile.length;s++)if(this.empty_tile[s])for(let i=0;i<this.empty_tile[s].length;i++){if(!this.empty_tile[s][i])continue;const[n,h]=e.getCords(this.empty_tile[s][i][0]+this.TILESIZE/2-10,this.empty_tile[s][i][1]+this.TILESIZE/2);t.fillStyle="green",t.font="normal 14px Arial",t.fillText(`${i},${s}`,n,h)}if(s.KeyP){const s=Object.keys(this.portalsGraph);for(let n=0;n<s.length;n++){const h=s[n].split(","),[o,r]=e.getCords(Number(h[0])*this.TILESIZE,Number(h[1])*this.TILESIZE);t.fillStyle="rgba(23, 74, 200,0.5)",t.fillRect(o,r,i,i),t.fill()}}}returnNewSpeed(t,e,s,i,n){const h=s-n,o=i-n,r=s-t,a=i-e;let l=r||a;for(let t=0;t<this.wall_map.length;t++)if(this.wall_map[t])for(let e=0;e<this.wall_map[t].length;e++){if(!this.wall_map[t][e])continue;const s=this.wall_map[t][e];h<s[0]+this.TILESIZE&&h+2*n>s[0]&&o<s[1]+this.TILESIZE&&o+2*n>s[1]&&(s[0]<h&&r&&(l=s[0]+this.TILESIZE-h+r),s[0]>h&&r&&(l=s[0]-(h+2*n)+r),s[1]<o&&a&&(l=s[1]+this.TILESIZE-o+a),s[1]>o&&a&&(l=s[1]-(o+2*n)+a))}return l}isCollisionWall(t,e){return!(!this.wall_map[Math.floor(e/this.TILESIZE)]||!this.wall_map[Math.floor(e/this.TILESIZE)][Math.floor(t/this.TILESIZE)])}}},(t,e,s)=>{Object.defineProperty(e,"__esModule",{value:!0}),e.SpawnPoint=void 0;const i=s(2);e.SpawnPoint=class{constructor(t,e,s,i,n){this.X=t,this.Y=e,this.SIZE=s,this.COLOR=i,this.ENEMYNUMBER=n}draw(t,e){const[s,i]=e.getCords(this.X,this.Y),n=e.getSize(this.SIZE);t.beginPath(),t.fillStyle=this.COLOR,t.fillRect(s,i,n,n),t.fill(),t.closePath()}checkCollision(t,e,s,i){const n=t-s,h=e-s;if(n<this.X+i.TILESIZE&&n+2*s>this.X&&h<this.Y+i.TILESIZE&&h+2*s>this.Y)return!0}spawn(){return this.ENEMYNUMBER>0?(this.ENEMYNUMBER--,new i.Enemy(this.X+this.SIZE/2,this.Y+this.SIZE/2,30,"red",4,15,200)):null}}},(t,e)=>{Object.defineProperty(e,"__esModule",{value:!0}),e.Camera=void 0,e.Camera=class{constructor(t,e,s,i){this.Z=1,this.maxZoom=5,this.minZoom=0,this.X=t,this.Y=e,this.CAMERAWIDTH=s,this.CAMERAHEIGHT=i}setPosition(t,e){this.X=t,this.Y=e}zoom(t){const e=this.Z+t;e<this.maxZoom&&e>this.minZoom&&(this.Z=e)}getSize(t){return t*this.Z}getCords(t,e){const s=this.CAMERAWIDTH/this.Z,i=this.CAMERAHEIGHT/this.Z,n=this.X-s/2,h=e-(this.Y-i/2);return[(t-n)*this.Z,h*this.Z]}}},(t,e,s)=>{Object.defineProperty(e,"__esModule",{value:!0}),e.Weapon=void 0;const i=s(12);e.Weapon=class{constructor(t,e,s,i,n){this.lastAtack=0,this.gunSize=e,this.bulletSpeed=t,this.bulletRadius=s,this.bulletDamage=i,this.attackSpeed=n}shoot(t){const e=t.X,s=t.Y,n=t.ANGLE,h=t.RADIUS+this.gunSize,o=performance.now()/1e3;this.attackSpeed+this.lastAtack<=o&&(i.BulletsController.createNewBullet(e+h*Math.cos(n),s+h*Math.sin(n),this.bulletSpeed,t.ANGLE,this.bulletRadius,this.bulletDamage),this.lastAtack=o)}draw(t,e,s,i,n,h){const o=h.getSize(this.gunSize);t.beginPath(),t.strokeStyle="black",t.lineWidth=h.getSize(8),t.moveTo(e+i*Math.cos(n),s+i*Math.sin(n)),t.lineTo(e+i*Math.cos(n)+o*Math.cos(n),s+i*Math.sin(n)+o*Math.sin(n)),t.closePath(),t.stroke()}}},(t,e,s)=>{Object.defineProperty(e,"__esModule",{value:!0}),e.Player=void 0;const i=s(0);e.Player=class{constructor(t,e,s,i,n,h){this.ANGLE=0,this.MAXHEALTH=100,this.HEALTH=this.MAXHEALTH,this.lastPositionTile="",this.lastPositionChunk="",this.nearportals=[],this.movementKeys={},this.X=t,this.Y=e,this.RADIUS=s,this.COLOR=i,this.SPEED=n,this.currentWeapon=h}setPosition(t,e){this.X=t,this.Y=e}getPosition(t){return`${Math.floor(this.X/t.TILESIZE)},${Math.floor(this.Y/t.TILESIZE)}`}checkChunk(t){const e=Math.floor(this.X/t.TILESIZE),s=Math.floor(this.Y/t.TILESIZE),n=`${e},${s}`,h=t.getChunkNumber(e,s);if(this.lastPositionTile!==`${e},${s}`){if(!this.nearportals.includes(this.lastPositionTile)){const e=i.EnemyController.getPositionEnemies();t.deleteTileToNearPortals(this.lastPositionTile,this.nearportals,e)}this.lastPositionChunk!==h&&(this.nearportals=t.setPathToPortalsFromTileOneChunk(e,s)),this.nearportals.includes(n)||t.addNewConnectTileToNearPortals(n,this.nearportals),this.lastPositionChunk=h,this.lastPositionTile=`${e},${s}`}}get health(){return this.HEALTH}shoot(){this.movementKeys[0]&&this.currentWeapon.shoot(this)}getDamage(t){this.HEALTH<=0||(this.HEALTH-=t)}draw(t,e){const[s,i]=e.getCords(this.X,this.Y),n=e.getSize(this.RADIUS);t.beginPath(),t.arc(s,i,n,0,2*Math.PI,!1),t.fillStyle=this.COLOR,t.fill();const h=2*n*(100*this.HEALTH/this.MAXHEALTH)/100;t.beginPath(),t.lineWidth=e.getSize(2),t.strokeStyle="black",t.moveTo(s-n-e.getSize(2),i+n+e.getSize(14)),t.lineTo(s+n,i+n+e.getSize(14)),t.lineTo(s+n,i+n+e.getSize(21)),t.lineTo(s-n-e.getSize(1),i+n+e.getSize(21)),t.lineTo(s-n-e.getSize(1),i+n+e.getSize(14)),t.stroke(),t.closePath(),t.fillStyle="red",t.fillRect(s-n,i+n+e.getSize(15),h,e.getSize(5)),this.currentWeapon.draw(t,s,i,n,this.ANGLE,e)}setPressedKey(t){this.movementKeys[t]=!0}setunPressedKey(t){this.movementKeys[t]=!1}setAngle(t,e,s){const[i,n]=s.getCords(this.X,this.Y),h=t-i,o=e-n;this.ANGLE=Math.atan2(o,h)}movement(t){if(this.movementKeys.KeyW){const e=t.returnNewSpeed(this.X,this.Y,this.X,this.Y-this.SPEED,this.RADIUS);i.EnemyController.collisionEnemyForPlayer(this.X,this.Y,this.X,this.Y-this.SPEED,this.RADIUS)||this.setPosition(this.X,this.Y+e)}if(this.movementKeys.KeyS){const e=t.returnNewSpeed(this.X,this.Y,this.X,this.Y+this.SPEED,this.RADIUS);i.EnemyController.collisionEnemyForPlayer(this.X,this.Y,this.X,this.Y+this.SPEED,this.RADIUS)||this.setPosition(this.X,this.Y+e)}if(this.movementKeys.KeyD){const e=t.returnNewSpeed(this.X,this.Y,this.X+this.SPEED,this.Y,this.RADIUS);i.EnemyController.collisionEnemyForPlayer(this.X,this.Y,this.X+this.SPEED,this.Y,this.RADIUS)||this.setPosition(this.X+e,this.Y)}if(this.movementKeys.KeyA){const e=t.returnNewSpeed(this.X,this.Y,this.X-this.SPEED,this.Y,this.RADIUS);i.EnemyController.collisionEnemyForPlayer(this.X,this.Y,this.X-this.SPEED,this.Y,this.RADIUS)||this.setPosition(this.X+e,this.Y)}}}},(t,e)=>{Object.defineProperty(e,"__esModule",{value:!0}),e.configGlobalKeys=void 0,e.configGlobalKeys={}},(t,e)=>{Object.defineProperty(e,"__esModule",{value:!0}),e.config=void 0,e.config={triggerEnemyTilesX:9,triggerEnemyTilesY:9}},(t,e)=>{Object.defineProperty(e,"__esModule",{value:!0}),e.default=function(t){t.fillStyle="#00ff4b",t.font="normal 20px Arial",t.fillText("R - restart",10,55),t.fillText("Mouse wheel - zoom",10,85)}}],e={};function s(i){var n=e[i];if(void 0!==n)return n.exports;var h=e[i]={id:i,exports:{}};return t[i].call(h.exports,h,h.exports,s),h.exports}s.n=t=>{var e=t&&t.__esModule?()=>t.default:()=>t;return s.d(e,{a:e}),e},s.d=(t,e)=>{for(var i in e)s.o(e,i)&&!s.o(t,i)&&Object.defineProperty(t,i,{enumerable:!0,get:e[i]})},s.o=(t,e)=>Object.prototype.hasOwnProperty.call(t,e),s.r=t=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},s(1)})();