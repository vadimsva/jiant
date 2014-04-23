(function($){

  /*        etc.js */  var trace=function(msg){if(typeof(window)=="undefined"||!window.console){return}var len=arguments.length;var args=[];for(var i=0;i<len;i++){args.push("arguments["+i+"]")}eval("console.log("+args.join(",")+")")};var dirname=function(a){var b=a.replace(/^\/?(.*?)\/?$/,"$1").split("/");b.pop();return"/"+b.join("/")};var basename=function(b){var c=b.replace(/^\/?(.*?)\/?$/,"$1").split("/");var a=c.pop();if(a==""){return null}else{return a}};var _ordinalize_re=/(\d)(?=(\d\d\d)+(?!\d))/g;var ordinalize=function(a){var b=""+a;if(a<11000){b=(""+a).replace(_ordinalize_re,"$1,")}else{if(a<1000000){b=Math.floor(a/1000)+"k"}else{if(a<1000000000){b=(""+Math.floor(a/1000)).replace(_ordinalize_re,"$1,")+"m"}}}return b};var nano=function(a,b){return a.replace(/\{([\w\-\.]*)}/g,function(f,c){var d=c.split("."),e=b[d.shift()];$.each(d,function(){if(e.hasOwnProperty(this)){e=e[this]}else{e=f}});return e})};var objcopy=function(a){if(a===undefined){return undefined}if(a===null){return null}if(a.parentNode){return a}switch(typeof a){case"string":return a.substring(0);break;case"number":return a+0;break;case"boolean":return a===true;break}var b=($.isArray(a))?[]:{};$.each(a,function(d,c){b[d]=objcopy(c)});return b};var objmerge=function(d,b){d=d||{};b=b||{};var c=objcopy(d);for(var a in b){c[a]=b[a]}return c};var objcmp=function(e,c,d){if(!e||!c){return e===c}if(typeof e!=typeof c){return false}if(typeof e!="object"){return e===c}else{if($.isArray(e)){if(!($.isArray(c))){return false}if(e.length!=c.length){return false}}else{var h=[];for(var f in e){if(e.hasOwnProperty(f)){h.push(f)}}var g=[];for(var f in c){if(c.hasOwnProperty(f)){g.push(f)}}if(!d){h.sort();g.sort()}if(h.join(",")!==g.join(",")){return false}}var i=true;$.each(e,function(a){var b=objcmp(e[a],c[a]);i=i&&b;if(!i){return false}});return i}};var objkeys=function(b){var a=[];$.each(b,function(d,c){if(b.hasOwnProperty(d)){a.push(d)}});return a};var objcontains=function(c){if(!c||typeof c!="object"){return false}for(var b=1,a=arguments.length;b<a;b++){if(c.hasOwnProperty(arguments[b])){return true}}return false};var uniq=function(b){var a=b.length;var d={};for(var c=0;c<a;c++){d[b[c]]=true}return objkeys(d)};var arbor_path=function(){var a=$("script").map(function(b){var c=$(this).attr("src");if(!c){return}if(c.match(/arbor[^\/\.]*.js|dev.js/)){return c.match(/.*\//)||"/"}});if(a.length>0){return a[0]}else{return null}};
  /*     kernel.js */  var Kernel=function(b){var k=window.location.protocol=="file:"&&navigator.userAgent.toLowerCase().indexOf("chrome")>-1;var a=(window.Worker!==undefined&&!k);var i=null;var c=null;var f=[];f.last=new Date();var l=null;var e=null;var d=null;var h=null;var g=false;var j={system:b,tween:null,nodes:{},init:function(){if(typeof(Tween)!="undefined"){c=Tween()}else{if(typeof(arbor.Tween)!="undefined"){c=arbor.Tween()}else{c={busy:function(){return false},tick:function(){return true},to:function(){trace("Please include arbor-tween.js to enable tweens");c.to=function(){};return}}}}j.tween=c;var m=b.parameters();if(a){trace("arbor.js/web-workers",m);l=setInterval(j.screenUpdate,m.timeout);i=new Worker("jiant.js");i.onmessage=j.workerMsg;i.onerror=function(n){trace("physics:",n)};i.postMessage({type:"physics",physics:objmerge(m,{timeout:Math.ceil(m.timeout)})})}else{trace("arbor.js/single-threaded",m);i=Physics(m.dt,m.stiffness,m.repulsion,m.friction,j.system._updateGeometry,m.integrator);j.start()}return j},graphChanged:function(m){if(a){i.postMessage({type:"changes",changes:m})}else{i._update(m)}j.start()},particleModified:function(n,m){if(a){i.postMessage({type:"modify",id:n,mods:m})}else{i.modifyNode(n,m)}j.start()},physicsModified:function(m){if(!isNaN(m.timeout)){if(a){clearInterval(l);l=setInterval(j.screenUpdate,m.timeout)}else{clearInterval(d);d=null}}if(a){i.postMessage({type:"sys",param:m})}else{i.modifyPhysics(m)}j.start()},workerMsg:function(n){var m=n.data.type;if(m=="geometry"){j.workerUpdate(n.data)}else{trace("physics:",n.data)}},_lastPositions:null,workerUpdate:function(m){j._lastPositions=m;j._lastBounds=m.bounds},_lastFrametime:new Date().valueOf(),_lastBounds:null,_currentRenderer:null,screenUpdate:function(){var n=new Date().valueOf();var m=false;if(j._lastPositions!==null){j.system._updateGeometry(j._lastPositions);j._lastPositions=null;m=true}if(c&&c.busy()){m=true}if(j.system._updateBounds(j._lastBounds)){m=true}if(m){var o=j.system.renderer;if(o!==undefined){if(o!==e){o.init(j.system);e=o}if(c){c.tick()}o.redraw();var p=f.last;f.last=new Date();f.push(f.last-p);if(f.length>50){f.shift()}}}},physicsUpdate:function(){if(c){c.tick()}i.tick();var n=j.system._updateBounds();if(c&&c.busy()){n=true}var o=j.system.renderer;var m=new Date();var o=j.system.renderer;if(o!==undefined){if(o!==e){o.init(j.system);e=o}o.redraw({timestamp:m})}var q=f.last;f.last=m;f.push(f.last-q);if(f.length>50){f.shift()}var p=i.systemEnergy();if((p.mean+p.max)/2<0.05){if(h===null){h=new Date().valueOf()}if(new Date().valueOf()-h>1000){clearInterval(d);d=null}else{}}else{h=null}},fps:function(n){if(n!==undefined){var q=1000/Math.max(1,targetFps);j.physicsModified({timeout:q})}var r=0;for(var p=0,o=f.length;p<o;p++){r+=f[p]}var m=r/Math.max(1,f.length);if(!isNaN(m)){return Math.round(1000/m)}else{return 0}},start:function(m){if(d!==null){return}if(g&&!m){return}g=false;if(a){i.postMessage({type:"start"})}else{h=null;d=setInterval(j.physicsUpdate,j.system.parameters().timeout)}},stop:function(){g=true;if(a){i.postMessage({type:"stop"})}else{if(d!==null){clearInterval(d);d=null}}}};return j.init()};
  /*      atoms.js */  var Node=function(a){this._id=_nextNodeId++;this.data=a||{};this._mass=(a.mass!==undefined)?a.mass:1;this._fixed=(a.fixed===true)?true:false;this._p=new Point((typeof(a.x)=="number")?a.x:null,(typeof(a.y)=="number")?a.y:null);delete this.data.x;delete this.data.y;delete this.data.mass;delete this.data.fixed};var _nextNodeId=1;var Edge=function(b,c,a){this._id=_nextEdgeId--;this.source=b;this.target=c;this.length=(a.length!==undefined)?a.length:1;this.data=(a!==undefined)?a:{};delete this.data.length};var _nextEdgeId=-1;var Particle=function(a,b){this.p=a;this.m=b;this.v=new Point(0,0);this.f=new Point(0,0)};Particle.prototype.applyForce=function(a){this.f=this.f.add(a.divide(this.m))};var Spring=function(c,b,d,a){this.point1=c;this.point2=b;this.length=d;this.k=a};Spring.prototype.distanceToParticle=function(a){var c=that.point2.p.subtract(that.point1.p).normalize().normal();var b=a.p.subtract(that.point1.p);return Math.abs(b.x*c.x+b.y*c.y)};var Point=function(a,b){if(a&&a.hasOwnProperty("y")){b=a.y;a=a.x}this.x=a;this.y=b};Point.random=function(a){a=(a!==undefined)?a:5;return new Point(2*a*(Math.random()-0.5),2*a*(Math.random()-0.5))};Point.prototype={exploded:function(){return(isNaN(this.x)||isNaN(this.y))},add:function(a){return new Point(this.x+a.x,this.y+a.y)},subtract:function(a){return new Point(this.x-a.x,this.y-a.y)},multiply:function(a){return new Point(this.x*a,this.y*a)},divide:function(a){return new Point(this.x/a,this.y/a)},magnitude:function(){return Math.sqrt(this.x*this.x+this.y*this.y)},normal:function(){return new Point(-this.y,this.x)},normalize:function(){return this.divide(this.magnitude())}};
  /*     system.js */  var ParticleSystem=function(e,r,f,g,u,m,s,a){var k=[];var i=null;var l=0;var v=null;var n=0.04;var j=[20,20,20,20];var o=null;var p=null;if(typeof e=="object"){var t=e;f=t.friction;e=t.repulsion;u=t.fps;m=t.dt;r=t.stiffness;g=t.gravity;s=t.precision;a=t.integrator}if(a!="verlet"&&a!="euler"){a="verlet"}f=isNaN(f)?0.5:f;e=isNaN(e)?1000:e;u=isNaN(u)?55:u;r=isNaN(r)?600:r;m=isNaN(m)?0.02:m;s=isNaN(s)?0.6:s;g=(g===true);var q=(u!==undefined)?1000/u:1000/50;var c={integrator:a,repulsion:e,stiffness:r,friction:f,dt:m,gravity:g,precision:s,timeout:q};var b;var d={renderer:null,tween:null,nodes:{},edges:{},adjacency:{},names:{},kernel:null};var h={parameters:function(w){if(w!==undefined){if(!isNaN(w.precision)){w.precision=Math.max(0,Math.min(1,w.precision))}$.each(c,function(y,x){if(w[y]!==undefined){c[y]=w[y]}});d.kernel.physicsModified(w)}return c},fps:function(w){if(w===undefined){return d.kernel.fps()}else{h.parameters({timeout:1000/(w||50)})}},start:function(){d.kernel.start()},stop:function(){d.kernel.stop()},addNode:function(z,C){C=C||{};var D=d.names[z];if(D){D.data=C;return D}else{if(z!=undefined){var w=(C.x!=undefined)?C.x:null;var E=(C.y!=undefined)?C.y:null;var B=(C.fixed)?1:0;var A=new Node(C);A.name=z;d.names[z]=A;d.nodes[A._id]=A;k.push({t:"addNode",id:A._id,m:A.mass,x:w,y:E,f:B});h._notify();return A}}},pruneNode:function(x){var w=h.getNode(x);if(typeof(d.nodes[w._id])!=="undefined"){delete d.nodes[w._id];delete d.names[w.name]}$.each(d.edges,function(z,y){if(y.source._id===w._id||y.target._id===w._id){h.pruneEdge(y)}});k.push({t:"dropNode",id:w._id});h._notify()},getNode:function(w){if(w._id!==undefined){return w}else{if(typeof w=="string"||typeof w=="number"){return d.names[w]}}},eachNode:function(w){$.each(d.nodes,function(z,y){if(y._p.x==null||y._p.y==null){return}var x=(v!==null)?h.toScreen(y._p):y._p;w.call(h,y,x)})},addEdge:function(A,B,z){A=h.getNode(A)||h.addNode(A);B=h.getNode(B)||h.addNode(B);z=z||{};var y=new Edge(A,B,z);var C=A._id;var D=B._id;d.adjacency[C]=d.adjacency[C]||{};d.adjacency[C][D]=d.adjacency[C][D]||[];var x=(d.adjacency[C][D].length>0);if(x){$.extend(d.adjacency[C][D].data,y.data);return}else{d.edges[y._id]=y;d.adjacency[C][D].push(y);var w=(y.length!==undefined)?y.length:1;k.push({t:"addSpring",id:y._id,fm:C,to:D,l:w});h._notify()}return y},pruneEdge:function(B){k.push({t:"dropSpring",id:B._id});delete d.edges[B._id];for(var w in d.adjacency){for(var C in d.adjacency[w]){var z=d.adjacency[w][C];for(var A=z.length-1;A>=0;A--){if(d.adjacency[w][C][A]._id===B._id){d.adjacency[w][C].splice(A,1)}}}}h._notify()},getEdges:function(x,w){x=h.getNode(x);w=h.getNode(w);if(!x||!w){return[]}if(typeof(d.adjacency[x._id])!=="undefined"&&typeof(d.adjacency[x._id][w._id])!=="undefined"){return d.adjacency[x._id][w._id]}return[]},getEdgesFrom:function(w){w=h.getNode(w);if(!w){return[]}if(typeof(d.adjacency[w._id])!=="undefined"){var x=[];$.each(d.adjacency[w._id],function(z,y){x=x.concat(y)});return x}return[]},getEdgesTo:function(w){w=h.getNode(w);if(!w){return[]}var x=[];$.each(d.edges,function(z,y){if(y.target==w){x.push(y)}});return x},eachEdge:function(w){$.each(d.edges,function(A,y){var z=d.nodes[y.source._id]._p;var x=d.nodes[y.target._id]._p;if(z.x==null||x.x==null){return}z=(v!==null)?h.toScreen(z):z;x=(v!==null)?h.toScreen(x):x;if(z&&x){w.call(h,y,z,x)}})},prune:function(x){var w={dropped:{nodes:[],edges:[]}};if(x===undefined){$.each(d.nodes,function(z,y){w.dropped.nodes.push(y);h.pruneNode(y)})}else{h.eachNode(function(z){var y=x.call(h,z,{from:h.getEdgesFrom(z),to:h.getEdgesTo(z)});if(y){w.dropped.nodes.push(z);h.pruneNode(z)}})}return w},graft:function(x){var w={added:{nodes:[],edges:[]}};if(x.nodes){$.each(x.nodes,function(z,y){var A=h.getNode(z);if(A){A.data=y}else{w.added.nodes.push(h.addNode(z,y))}d.kernel.start()})}if(x.edges){$.each(x.edges,function(A,y){var z=h.getNode(A);if(!z){w.added.nodes.push(h.addNode(A,{}))}$.each(y,function(E,B){var D=h.getNode(E);if(!D){w.added.nodes.push(h.addNode(E,{}))}var C=h.getEdges(A,E);if(C.length>0){C[0].data=B}else{w.added.edges.push(h.addEdge(A,E,B))}})})}return w},merge:function(x){var w={added:{nodes:[],edges:[]},dropped:{nodes:[],edges:[]}};$.each(d.edges,function(B,A){if((x.edges[A.source.name]===undefined||x.edges[A.source.name][A.target.name]===undefined)){h.pruneEdge(A);w.dropped.edges.push(A)}});var z=h.prune(function(B,A){if(x.nodes[B.name]===undefined){w.dropped.nodes.push(B);return true}});var y=h.graft(x);w.added.nodes=w.added.nodes.concat(y.added.nodes);w.added.edges=w.added.edges.concat(y.added.edges);w.dropped.nodes=w.dropped.nodes.concat(z.dropped.nodes);w.dropped.edges=w.dropped.edges.concat(z.dropped.edges);return w},tweenNode:function(z,w,y){var x=h.getNode(z);if(x){d.tween.to(x,w,y)}},tweenEdge:function(x,w,A,z){if(z===undefined){h._tweenEdge(x,w,A)}else{var y=h.getEdges(x,w);$.each(y,function(B,C){h._tweenEdge(C,A,z)})}},_tweenEdge:function(x,w,y){if(x&&x._id!==undefined){d.tween.to(x,w,y)}},_updateGeometry:function(z){if(z!=undefined){var w=(z.epoch<l);b=z.energy;var A=z.geometry;if(A!==undefined){for(var y=0,x=A.length/3;y<x;y++){var B=A[3*y];if(w&&d.nodes[B]==undefined){continue}d.nodes[B]._p.x=A[3*y+1];d.nodes[B]._p.y=A[3*y+2]}}}},screen:function(w){if(w==undefined){return{size:(v)?objcopy(v):undefined,padding:j.concat(),step:n}}if(w.size!==undefined){h.screenSize(w.size.width,w.size.height)}if(!isNaN(w.step)){h.screenStep(w.step)}if(w.padding!==undefined){h.screenPadding(w.padding)}},screenSize:function(w,x){v={width:w,height:x};h._updateBounds()},screenPadding:function(z,A,w,x){if($.isArray(z)){trbl=z}else{trbl=[z,A,w,x]}var B=trbl[0];var y=trbl[1];var C=trbl[2];if(y===undefined){trbl=[B,B,B,B]}else{if(C==undefined){trbl=[B,y,B,y]}}j=trbl},screenStep:function(w){n=w},toScreen:function(y){if(!o||!v){return}var x=j||[0,0,0,0];var w=o.bottomright.subtract(o.topleft);var A=x[3]+y.subtract(o.topleft).divide(w.x).x*(v.width-(x[1]+x[3]));var z=x[0]+y.subtract(o.topleft).divide(w.y).y*(v.height-(x[0]+x[2]));return arbor.Point(A,z)},fromScreen:function(A){if(!o||!v){return}var z=j||[0,0,0,0];var y=o.bottomright.subtract(o.topleft);var x=(A.x-z[3])/(v.width-(z[1]+z[3]))*y.x+o.topleft.x;var w=(A.y-z[0])/(v.height-(z[0]+z[2]))*y.y+o.topleft.y;return arbor.Point(x,w)},_updateBounds:function(x){if(v===null){return}if(x){p=x}else{p=h.bounds()}var A=new Point(p.bottomright.x,p.bottomright.y);var z=new Point(p.topleft.x,p.topleft.y);var C=A.subtract(z);var w=z.add(C.divide(2));var y=4;var E=new Point(Math.max(C.x,y),Math.max(C.y,y));p.topleft=w.subtract(E.divide(2));p.bottomright=w.add(E.divide(2));if(!o){if($.isEmptyObject(d.nodes)){return false}o=p;return true}var D=n;_newBounds={bottomright:o.bottomright.add(p.bottomright.subtract(o.bottomright).multiply(D)),topleft:o.topleft.add(p.topleft.subtract(o.topleft).multiply(D))};var B=new Point(o.topleft.subtract(_newBounds.topleft).magnitude(),o.bottomright.subtract(_newBounds.bottomright).magnitude());if(B.x*v.width>1||B.y*v.height>1){o=_newBounds;return true}else{return false}},energy:function(){return b},bounds:function(){var x=null;var w=null;$.each(d.nodes,function(A,z){if(!x){x=new Point(z._p);w=new Point(z._p);return}var y=z._p;if(y.x===null||y.y===null){return}if(y.x>x.x){x.x=y.x}if(y.y>x.y){x.y=y.y}if(y.x<w.x){w.x=y.x}if(y.y<w.y){w.y=y.y}});if(x&&w){return{bottomright:x,topleft:w}}else{return{topleft:new Point(-1,-1),bottomright:new Point(1,1)}}},nearest:function(y){if(v!==null){y=h.fromScreen(y)}var x={node:null,point:null,distance:null};var w=h;$.each(d.nodes,function(C,z){var A=z._p;if(A.x===null||A.y===null){return}var B=A.subtract(y).magnitude();if(x.distance===null||B<x.distance){x={node:z,point:A,distance:B};if(v!==null){x.screenPoint=h.toScreen(A)}}});if(x.node){if(v!==null){x.distance=h.toScreen(x.node.p).subtract(h.toScreen(y)).magnitude()}return x}else{return null}},_notify:function(){if(i===null){l++}else{clearTimeout(i)}i=setTimeout(h._synchronize,20)},_synchronize:function(){if(k.length>0){d.kernel.graphChanged(k);k=[];i=null}},};d.kernel=Kernel(h);d.tween=d.kernel.tween||null;Node.prototype.__defineGetter__("p",function(){var x=this;var w={};w.__defineGetter__("x",function(){return x._p.x});w.__defineSetter__("x",function(y){d.kernel.particleModified(x._id,{x:y})});w.__defineGetter__("y",function(){return x._p.y});w.__defineSetter__("y",function(y){d.kernel.particleModified(x._id,{y:y})});w.__proto__=Point.prototype;return w});Node.prototype.__defineSetter__("p",function(w){this._p.x=w.x;this._p.y=w.y;d.kernel.particleModified(this._id,{x:w.x,y:w.y})});Node.prototype.__defineGetter__("mass",function(){return this._mass});Node.prototype.__defineSetter__("mass",function(w){this._mass=w;d.kernel.particleModified(this._id,{m:w})});Node.prototype.__defineSetter__("tempMass",function(w){d.kernel.particleModified(this._id,{_m:w})});Node.prototype.__defineGetter__("fixed",function(){return this._fixed});Node.prototype.__defineSetter__("fixed",function(w){this._fixed=w;d.kernel.particleModified(this._id,{f:w?1:0})});return h};
  /* barnes-hut.js */  var BarnesHutTree=function(){var b=[];var a=0;var e=null;var d=0.5;var c={init:function(g,h,f){d=f;a=0;e=c._newBranch();e.origin=g;e.size=h.subtract(g)},insert:function(j){var f=e;var g=[j];while(g.length){var h=g.shift();var m=h._m||h.m;var p=c._whichQuad(h,f);if(f[p]===undefined){f[p]=h;f.mass+=m;if(f.p){f.p=f.p.add(h.p.multiply(m))}else{f.p=h.p.multiply(m)}}else{if("origin" in f[p]){f.mass+=(m);if(f.p){f.p=f.p.add(h.p.multiply(m))}else{f.p=h.p.multiply(m)}f=f[p];g.unshift(h)}else{var l=f.size.divide(2);var n=new Point(f.origin);if(p[0]=="s"){n.y+=l.y}if(p[1]=="e"){n.x+=l.x}var o=f[p];f[p]=c._newBranch();f[p].origin=n;f[p].size=l;f.mass=m;f.p=h.p.multiply(m);f=f[p];if(o.p.x===h.p.x&&o.p.y===h.p.y){var k=l.x*0.08;var i=l.y*0.08;o.p.x=Math.min(n.x+l.x,Math.max(n.x,o.p.x-k/2+Math.random()*k));o.p.y=Math.min(n.y+l.y,Math.max(n.y,o.p.y-i/2+Math.random()*i))}g.push(o);g.unshift(h)}}}},applyForces:function(m,g){var f=[e];while(f.length){node=f.shift();if(node===undefined){continue}if(m===node){continue}if("f" in node){var k=m.p.subtract(node.p);var l=Math.max(1,k.magnitude());var i=((k.magnitude()>0)?k:Point.random(1)).normalize();m.applyForce(i.multiply(g*(node._m||node.m)).divide(l*l))}else{var j=m.p.subtract(node.p.divide(node.mass)).magnitude();var h=Math.sqrt(node.size.x*node.size.y);if(h/j>d){f.push(node.ne);f.push(node.nw);f.push(node.se);f.push(node.sw)}else{var k=m.p.subtract(node.p.divide(node.mass));var l=Math.max(1,k.magnitude());var i=((k.magnitude()>0)?k:Point.random(1)).normalize();m.applyForce(i.multiply(g*(node.mass)).divide(l*l))}}}},_whichQuad:function(i,f){if(i.p.exploded()){return null}var h=i.p.subtract(f.origin);var g=f.size.divide(2);if(h.y<g.y){if(h.x<g.x){return"nw"}else{return"ne"}}else{if(h.x<g.x){return"sw"}else{return"se"}}},_newBranch:function(){if(b[a]){var f=b[a];f.ne=f.nw=f.se=f.sw=undefined;f.mass=0;delete f.p}else{f={origin:null,size:null,nw:undefined,ne:undefined,sw:undefined,se:undefined,mass:0};b[a]=f}a++;return f}};return c};
  /*    physics.js */  var Physics=function(a,m,n,e,h,o){var f=BarnesHutTree();var c={particles:{},springs:{}};var l={particles:{}};var p=[];var k=[];var d=0;var b={sum:0,max:0,mean:0};var g={topleft:new Point(-1,-1),bottomright:new Point(1,1)};var j=1000;var i={integrator:["verlet","euler"].indexOf(o)>=0?o:"verlet",stiffness:(m!==undefined)?m:1000,repulsion:(n!==undefined)?n:600,friction:(e!==undefined)?e:0.3,gravity:false,dt:(a!==undefined)?a:0.02,theta:0.4,init:function(){return i},modifyPhysics:function(q){$.each(["stiffness","repulsion","friction","gravity","dt","precision","integrator"],function(s,t){if(q[t]!==undefined){if(t=="precision"){i.theta=1-q[t];return}i[t]=q[t];if(t=="stiffness"){var r=q[t];$.each(c.springs,function(v,u){u.k=r})}}})},addNode:function(v){var u=v.id;var r=v.m;var q=g.bottomright.x-g.topleft.x;var t=g.bottomright.y-g.topleft.y;var s=new Point((v.x!=null)?v.x:g.topleft.x+q*Math.random(),(v.y!=null)?v.y:g.topleft.y+t*Math.random());c.particles[u]=new Particle(s,r);c.particles[u].connections=0;c.particles[u].fixed=(v.f===1);l.particles[u]=c.particles[u];p.push(c.particles[u])},dropNode:function(t){var s=t.id;var r=c.particles[s];var q=$.inArray(r,p);if(q>-1){p.splice(q,1)}delete c.particles[s];delete l.particles[s]},modifyNode:function(s,q){if(s in c.particles){var r=c.particles[s];if("x" in q){r.p.x=q.x}if("y" in q){r.p.y=q.y}if("m" in q){r.m=q.m}if("f" in q){r.fixed=(q.f===1)}if("_m" in q){if(r._m===undefined){r._m=r.m}r.m=q._m}}},addSpring:function(u){var t=u.id;var q=u.l;var s=c.particles[u.fm];var r=c.particles[u.to];if(s!==undefined&&r!==undefined){c.springs[t]=new Spring(s,r,q,i.stiffness);k.push(c.springs[t]);s.connections++;r.connections++;delete l.particles[u.fm];delete l.particles[u.to]}},dropSpring:function(t){var s=t.id;var r=c.springs[s];r.point1.connections--;r.point2.connections--;var q=$.inArray(r,k);if(q>-1){k.splice(q,1)}delete c.springs[s]},_update:function(q){d++;$.each(q,function(r,s){if(s.t in i){i[s.t](s)}});return d},tick:function(){i.tendParticles();if(i.integrator=="euler"){i.updateForces();i.updateVelocity(i.dt);i.updatePosition(i.dt)}else{i.updateForces();i.cacheForces();i.updatePosition(i.dt);i.updateForces();i.updateVelocity(i.dt)}i.tock()},tock:function(){var q=[];$.each(c.particles,function(s,r){q.push(s);q.push(r.p.x);q.push(r.p.y)});if(h){h({geometry:q,epoch:d,energy:b,bounds:g})}},tendParticles:function(){$.each(c.particles,function(r,q){if(q._m!==undefined){if(Math.abs(q.m-q._m)<1){q.m=q._m;delete q._m}else{q.m*=0.98}}q.v.x=q.v.y=0})},updateForces:function(){if(i.repulsion>0){if(i.theta>0){i.applyBarnesHutRepulsion()}else{i.applyBruteForceRepulsion()}}if(i.stiffness>0){i.applySprings()}i.applyCenterDrift();if(i.gravity){i.applyCenterGravity()}},cacheForces:function(){$.each(c.particles,function(r,q){q._F=q.f})},applyBruteForceRepulsion:function(){$.each(c.particles,function(r,q){$.each(c.particles,function(t,s){if(q!==s){var v=q.p.subtract(s.p);var w=Math.max(1,v.magnitude());var u=((v.magnitude()>0)?v:Point.random(1)).normalize();q.applyForce(u.multiply(i.repulsion*(s._m||s.m)*0.5).divide(w*w*0.5));s.applyForce(u.multiply(i.repulsion*(q._m||q.m)*0.5).divide(w*w*-0.5))}})})},applyBarnesHutRepulsion:function(){if(!g.topleft||!g.bottomright){return}var r=new Point(g.bottomright);var q=new Point(g.topleft);f.init(q,r,i.theta);$.each(c.particles,function(t,s){f.insert(s)});$.each(c.particles,function(t,s){f.applyForces(s,i.repulsion)})},applySprings:function(){$.each(c.springs,function(u,q){var t=q.point2.p.subtract(q.point1.p);var r=q.length-t.magnitude();var s=((t.magnitude()>0)?t:Point.random(1)).normalize();q.point1.applyForce(s.multiply(q.k*r*-0.5));q.point2.applyForce(s.multiply(q.k*r*0.5))})},applyCenterDrift:function(){var r=0;var s=new Point(0,0);$.each(c.particles,function(u,t){s.add(t.p);r++});if(r==0){return}var q=s.divide(-r);$.each(c.particles,function(u,t){t.applyForce(q)})},applyCenterGravity:function(){$.each(c.particles,function(s,q){var r=q.p.multiply(-1);q.applyForce(r.multiply(i.repulsion/100))})},updateVelocity:function(r){var s=0,q=0,t=0;$.each(c.particles,function(x,u){if(u.fixed){u.v=new Point(0,0);u.f=new Point(0,0);return}if(i.integrator=="euler"){u.v=u.v.add(u.f.multiply(r)).multiply(1-i.friction)}else{u.v=u.v.add(u.f.add(u._F.divide(u._m)).multiply(r*0.5)).multiply(1-i.friction)}u.f.x=u.f.y=0;var v=u.v.magnitude();if(v>j){u.v=u.v.divide(v*v)}var v=u.v.magnitude();var w=v*v;s+=w;q=Math.max(w,q);t++});b={sum:s,max:q,mean:s/t,n:t}},updatePosition:function(q){var s=null;var r=null;$.each(c.particles,function(v,u){if(i.integrator=="euler"){u.p=u.p.add(u.v.multiply(q))}else{var t=u.f.multiply(0.5*q*q).divide(u.m);u.p=u.p.add(u.v.multiply(q)).add(t)}if(!s){s=new Point(u.p.x,u.p.y);r=new Point(u.p.x,u.p.y);return}var w=u.p;if(w.x===null||w.y===null){return}if(w.x>s.x){s.x=w.x}if(w.y>s.y){s.y=w.y}if(w.x<r.x){r.x=w.x}if(w.y<r.y){r.y=w.y}});g={topleft:r||new Point(-1,-1),bottomright:s||new Point(1,1)}},systemEnergy:function(q){return b}};return i.init()};var _nearParticle=function(b,c){var c=c||0;var a=b.x;var f=b.y;var e=c*2;return new Point(a-c+Math.random()*e,f-c+Math.random()*e)};

  // if called as a worker thread, set up a run loop for the Physics object and bail out
  if (typeof(window)=='undefined') return (function(){
  /* hermetic.js */  $={each:function(d,e){if($.isArray(d)){for(var c=0,b=d.length;c<b;c++){e(c,d[c])}}else{for(var a in d){e(a,d[a])}}},map:function(a,c){var b=[];$.each(a,function(f,e){var d=c(e);if(d!==undefined){b.push(d)}});return b},extend:function(c,b){if(typeof b!="object"){return c}for(var a in b){if(b.hasOwnProperty(a)){c[a]=b[a]}}return c},isArray:function(a){if(!a){return false}return(a.constructor.toString().indexOf("Array")!=-1)},inArray:function(c,a){for(var d=0,b=a.length;d<b;d++){if(a[d]===c){return d}}return -1},isEmptyObject:function(a){if(typeof a!=="object"){return false}var b=true;$.each(a,function(c,d){b=false});return b},};
  /*     worker.js */  var PhysicsWorker=function(){var b=20;var a=null;var d=null;var c=null;var g=[];var f=new Date().valueOf();var e={init:function(h){e.timeout(h.timeout);a=Physics(h.dt,h.stiffness,h.repulsion,h.friction,e.tock);return e},timeout:function(h){if(h!=b){b=h;if(d!==null){e.stop();e.go()}}},go:function(){if(d!==null){return}c=null;d=setInterval(e.tick,b)},stop:function(){if(d===null){return}clearInterval(d);d=null},tick:function(){a.tick();var h=a.systemEnergy();if((h.mean+h.max)/2<0.05){if(c===null){c=new Date().valueOf()}if(new Date().valueOf()-c>1000){e.stop()}else{}}else{c=null}},tock:function(h){h.type="geometry";postMessage(h)},modifyNode:function(i,h){a.modifyNode(i,h);e.go()},modifyPhysics:function(h){a.modifyPhysics(h)},update:function(h){var i=a._update(h)}};return e};var physics=PhysicsWorker();onmessage=function(a){if(!a.data.type){postMessage("¿kérnèl?");return}if(a.data.type=="physics"){var b=a.data.physics;physics.init(a.data.physics);return}switch(a.data.type){case"modify":physics.modifyNode(a.data.id,a.data.mods);break;case"changes":physics.update(a.data.changes);physics.go();break;case"start":physics.go();break;case"stop":physics.stop();break;case"sys":var b=a.data.param||{};if(!isNaN(b.timeout)){physics.timeout(b.timeout)}physics.modifyPhysics(b);physics.go();break}};
  })()


  arbor = (typeof(arbor)!=='undefined') ? arbor : {}
  $.extend(arbor, {
    // object constructors (don't use ‘new’, just call them)
    ParticleSystem:ParticleSystem,
    Point:function(x, y){ return new Point(x, y) },

    // immutable object with useful methods
    etc:{
      trace:trace,              // ƒ(msg) -> safe console logging
      dirname:dirname,          // ƒ(path) -> leading part of path
      basename:basename,        // ƒ(path) -> trailing part of path
      ordinalize:ordinalize,    // ƒ(num) -> abbrev integers (and add commas)
      objcopy:objcopy,          // ƒ(old) -> clone an object
      objcmp:objcmp,            // ƒ(a, b, strict_ordering) -> t/f comparison
      objkeys:objkeys,          // ƒ(obj) -> array of all keys in obj
      objmerge:objmerge,        // ƒ(dst, src) -> like $.extend but non-destructive
      uniq:uniq,                // ƒ(arr) -> array of unique items in arr
      arbor_path:arbor_path,    // ƒ() -> guess the directory of the lib code
    }
  })

})(this.jQuery);

(function($){

  /*    etc.js */  var trace=function(msg){if(typeof(window)=="undefined"||!window.console){return}var len=arguments.length;var args=[];for(var i=0;i<len;i++){args.push("arguments["+i+"]")}eval("console.log("+args.join(",")+")")};var dirname=function(a){var b=a.replace(/^\/?(.*?)\/?$/,"$1").split("/");b.pop();return"/"+b.join("/")};var basename=function(b){var c=b.replace(/^\/?(.*?)\/?$/,"$1").split("/");var a=c.pop();if(a==""){return null}else{return a}};var _ordinalize_re=/(\d)(?=(\d\d\d)+(?!\d))/g;var ordinalize=function(a){var b=""+a;if(a<11000){b=(""+a).replace(_ordinalize_re,"$1,")}else{if(a<1000000){b=Math.floor(a/1000)+"k"}else{if(a<1000000000){b=(""+Math.floor(a/1000)).replace(_ordinalize_re,"$1,")+"m"}}}return b};var nano=function(a,b){return a.replace(/\{([\w\-\.]*)}/g,function(f,c){var d=c.split("."),e=b[d.shift()];$.each(d,function(){if(e.hasOwnProperty(this)){e=e[this]}else{e=f}});return e})};var objcopy=function(a){if(a===undefined){return undefined}if(a===null){return null}if(a.parentNode){return a}switch(typeof a){case"string":return a.substring(0);break;case"number":return a+0;break;case"boolean":return a===true;break}var b=($.isArray(a))?[]:{};$.each(a,function(d,c){b[d]=objcopy(c)});return b};var objmerge=function(d,b){d=d||{};b=b||{};var c=objcopy(d);for(var a in b){c[a]=b[a]}return c};var objcmp=function(e,c,d){if(!e||!c){return e===c}if(typeof e!=typeof c){return false}if(typeof e!="object"){return e===c}else{if($.isArray(e)){if(!($.isArray(c))){return false}if(e.length!=c.length){return false}}else{var h=[];for(var f in e){if(e.hasOwnProperty(f)){h.push(f)}}var g=[];for(var f in c){if(c.hasOwnProperty(f)){g.push(f)}}if(!d){h.sort();g.sort()}if(h.join(",")!==g.join(",")){return false}}var i=true;$.each(e,function(a){var b=objcmp(e[a],c[a]);i=i&&b;if(!i){return false}});return i}};var objkeys=function(b){var a=[];$.each(b,function(d,c){if(b.hasOwnProperty(d)){a.push(d)}});return a};var objcontains=function(c){if(!c||typeof c!="object"){return false}for(var b=1,a=arguments.length;b<a;b++){if(c.hasOwnProperty(arguments[b])){return true}}return false};var uniq=function(b){var a=b.length;var d={};for(var c=0;c<a;c++){d[b[c]]=true}return objkeys(d)};var arbor_path=function(){var a=$("script").map(function(b){var c=$(this).attr("src");if(!c){return}if(c.match(/arbor[^\/\.]*.js|dev.js/)){return c.match(/.*\//)||"/"}});if(a.length>0){return a[0]}else{return null}};
  /* colors.js */  var Colors=(function(){var f=/#[0-9a-f]{6}/i;var b=/#(..)(..)(..)/;var c=function(h){var g=h.toString(16);return(g.length==2)?g:"0"+g};var a=function(g){return parseInt(g,16)};var d=function(g){if(!g||typeof g!="object"){return false}var h=objkeys(g).sort().join("");if(h=="abgr"){return true}};var e={CSS:{aliceblue:"#f0f8ff",antiquewhite:"#faebd7",aqua:"#00ffff",aquamarine:"#7fffd4",azure:"#f0ffff",beige:"#f5f5dc",bisque:"#ffe4c4",black:"#000000",blanchedalmond:"#ffebcd",blue:"#0000ff",blueviolet:"#8a2be2",brown:"#a52a2a",burlywood:"#deb887",cadetblue:"#5f9ea0",chartreuse:"#7fff00",chocolate:"#d2691e",coral:"#ff7f50",cornflowerblue:"#6495ed",cornsilk:"#fff8dc",crimson:"#dc143c",cyan:"#00ffff",darkblue:"#00008b",darkcyan:"#008b8b",darkgoldenrod:"#b8860b",darkgray:"#a9a9a9",darkgrey:"#a9a9a9",darkgreen:"#006400",darkkhaki:"#bdb76b",darkmagenta:"#8b008b",darkolivegreen:"#556b2f",darkorange:"#ff8c00",darkorchid:"#9932cc",darkred:"#8b0000",darksalmon:"#e9967a",darkseagreen:"#8fbc8f",darkslateblue:"#483d8b",darkslategray:"#2f4f4f",darkslategrey:"#2f4f4f",darkturquoise:"#00ced1",darkviolet:"#9400d3",deeppink:"#ff1493",deepskyblue:"#00bfff",dimgray:"#696969",dimgrey:"#696969",dodgerblue:"#1e90ff",firebrick:"#b22222",floralwhite:"#fffaf0",forestgreen:"#228b22",fuchsia:"#ff00ff",gainsboro:"#dcdcdc",ghostwhite:"#f8f8ff",gold:"#ffd700",goldenrod:"#daa520",gray:"#808080",grey:"#808080",green:"#008000",greenyellow:"#adff2f",honeydew:"#f0fff0",hotpink:"#ff69b4",indianred:"#cd5c5c",indigo:"#4b0082",ivory:"#fffff0",khaki:"#f0e68c",lavender:"#e6e6fa",lavenderblush:"#fff0f5",lawngreen:"#7cfc00",lemonchiffon:"#fffacd",lightblue:"#add8e6",lightcoral:"#f08080",lightcyan:"#e0ffff",lightgoldenrodyellow:"#fafad2",lightgray:"#d3d3d3",lightgrey:"#d3d3d3",lightgreen:"#90ee90",lightpink:"#ffb6c1",lightsalmon:"#ffa07a",lightseagreen:"#20b2aa",lightskyblue:"#87cefa",lightslategray:"#778899",lightslategrey:"#778899",lightsteelblue:"#b0c4de",lightyellow:"#ffffe0",lime:"#00ff00",limegreen:"#32cd32",linen:"#faf0e6",magenta:"#ff00ff",maroon:"#800000",mediumaquamarine:"#66cdaa",mediumblue:"#0000cd",mediumorchid:"#ba55d3",mediumpurple:"#9370d8",mediumseagreen:"#3cb371",mediumslateblue:"#7b68ee",mediumspringgreen:"#00fa9a",mediumturquoise:"#48d1cc",mediumvioletred:"#c71585",midnightblue:"#191970",mintcream:"#f5fffa",mistyrose:"#ffe4e1",moccasin:"#ffe4b5",navajowhite:"#ffdead",navy:"#000080",oldlace:"#fdf5e6",olive:"#808000",olivedrab:"#6b8e23",orange:"#ffa500",orangered:"#ff4500",orchid:"#da70d6",palegoldenrod:"#eee8aa",palegreen:"#98fb98",paleturquoise:"#afeeee",palevioletred:"#d87093",papayawhip:"#ffefd5",peachpuff:"#ffdab9",peru:"#cd853f",pink:"#ffc0cb",plum:"#dda0dd",powderblue:"#b0e0e6",purple:"#800080",red:"#ff0000",rosybrown:"#bc8f8f",royalblue:"#4169e1",saddlebrown:"#8b4513",salmon:"#fa8072",sandybrown:"#f4a460",seagreen:"#2e8b57",seashell:"#fff5ee",sienna:"#a0522d",silver:"#c0c0c0",skyblue:"#87ceeb",slateblue:"#6a5acd",slategray:"#708090",slategrey:"#708090",snow:"#fffafa",springgreen:"#00ff7f",steelblue:"#4682b4",tan:"#d2b48c",teal:"#008080",thistle:"#d8bfd8",tomato:"#ff6347",turquoise:"#40e0d0",violet:"#ee82ee",wheat:"#f5deb3",white:"#ffffff",whitesmoke:"#f5f5f5",yellow:"#ffff00",yellowgreen:"#9acd32"},decode:function(h){var g=arguments.length;for(var l=g-1;l>=0;l--){if(arguments[l]===undefined){g--}}var k=arguments;if(!h){return null}if(g==1&&d(h)){return h}var j=null;if(typeof h=="string"){var o=1;if(g==2){o=k[1]}var n=e.CSS[h.toLowerCase()];if(n!==undefined){h=n}var m=h.match(f);if(m){vals=h.match(b);if(!vals||!vals.length||vals.length!=4){return null}j={r:a(vals[1]),g:a(vals[2]),b:a(vals[3]),a:o}}}else{if(typeof h=="number"){if(g>=3){j={r:k[0],g:k[1],b:k[2],a:1};if(g>=4){j.a*=k[3]}}else{if(g>=1){j={r:k[0],g:k[0],b:k[0],a:1};if(g==2){j.a*=k[1]}}}}}return j},validate:function(g){if(!g||typeof g!="string"){return false}if(e.CSS[g.toLowerCase()]!==undefined){return true}if(g.match(f)){return true}return false},mix:function(h,g,k){var j=e.decode(h);var i=e.decode(g)},blend:function(g,j){j=(j!==undefined)?Math.max(0,Math.min(1,j)):1;var h=e.decode(g);if(!h){return null}if(j==1){return g}var h=g;if(typeof g=="string"){h=e.decode(g)}var i=objcopy(h);i.a*=j;return nano("rgba({r},{g},{b},{a})",i)},encode:function(g){if(!d(g)){g=e.decode(g);if(!d(g)){return null}}if(g.a==1){return nano("#{r}{g}{b}",{r:c(g.r),g:c(g.g),b:c(g.b)})}else{return nano("rgba({r},{g},{b},{a})",g)}}};return e})();
  /* easing.js */  var Easing=(function(){var a={linear:function(f,e,h,g){return h*(f/g)+e},quadin:function(f,e,h,g){return h*(f/=g)*f+e},quadout:function(f,e,h,g){return -h*(f/=g)*(f-2)+e},quadinout:function(f,e,h,g){if((f/=g/2)<1){return h/2*f*f+e}return -h/2*((--f)*(f-2)-1)+e},cubicin:function(f,e,h,g){return h*(f/=g)*f*f+e},cubicout:function(f,e,h,g){return h*((f=f/g-1)*f*f+1)+e},cubicinout:function(f,e,h,g){if((f/=g/2)<1){return h/2*f*f*f+e}return h/2*((f-=2)*f*f+2)+e},quartin:function(f,e,h,g){return h*(f/=g)*f*f*f+e},quartout:function(f,e,h,g){return -h*((f=f/g-1)*f*f*f-1)+e},quartinout:function(f,e,h,g){if((f/=g/2)<1){return h/2*f*f*f*f+e}return -h/2*((f-=2)*f*f*f-2)+e},quintin:function(f,e,h,g){return h*(f/=g)*f*f*f*f+e},quintout:function(f,e,h,g){return h*((f=f/g-1)*f*f*f*f+1)+e},quintinout:function(f,e,h,g){if((f/=g/2)<1){return h/2*f*f*f*f*f+e}return h/2*((f-=2)*f*f*f*f+2)+e},sinein:function(f,e,h,g){return -h*Math.cos(f/g*(Math.PI/2))+h+e},sineout:function(f,e,h,g){return h*Math.sin(f/g*(Math.PI/2))+e},sineinout:function(f,e,h,g){return -h/2*(Math.cos(Math.PI*f/g)-1)+e},expoin:function(f,e,h,g){return(f==0)?e:h*Math.pow(2,10*(f/g-1))+e},expoout:function(f,e,h,g){return(f==g)?e+h:h*(-Math.pow(2,-10*f/g)+1)+e},expoinout:function(f,e,h,g){if(f==0){return e}if(f==g){return e+h}if((f/=g/2)<1){return h/2*Math.pow(2,10*(f-1))+e}return h/2*(-Math.pow(2,-10*--f)+2)+e},circin:function(f,e,h,g){return -h*(Math.sqrt(1-(f/=g)*f)-1)+e},circout:function(f,e,h,g){return h*Math.sqrt(1-(f=f/g-1)*f)+e},circinout:function(f,e,h,g){if((f/=g/2)<1){return -h/2*(Math.sqrt(1-f*f)-1)+e}return h/2*(Math.sqrt(1-(f-=2)*f)+1)+e},elasticin:function(g,e,k,j){var h=1.70158;var i=0;var f=k;if(g==0){return e}if((g/=j)==1){return e+k}if(!i){i=j*0.3}if(f<Math.abs(k)){f=k;var h=i/4}else{var h=i/(2*Math.PI)*Math.asin(k/f)}return -(f*Math.pow(2,10*(g-=1))*Math.sin((g*j-h)*(2*Math.PI)/i))+e},elasticout:function(g,e,k,j){var h=1.70158;var i=0;var f=k;if(g==0){return e}if((g/=j)==1){return e+k}if(!i){i=j*0.3}if(f<Math.abs(k)){f=k;var h=i/4}else{var h=i/(2*Math.PI)*Math.asin(k/f)}return f*Math.pow(2,-10*g)*Math.sin((g*j-h)*(2*Math.PI)/i)+k+e},elasticinout:function(g,e,k,j){var h=1.70158;var i=0;var f=k;if(g==0){return e}if((g/=j/2)==2){return e+k}if(!i){i=j*(0.3*1.5)}if(f<Math.abs(k)){f=k;var h=i/4}else{var h=i/(2*Math.PI)*Math.asin(k/f)}if(g<1){return -0.5*(f*Math.pow(2,10*(g-=1))*Math.sin((g*j-h)*(2*Math.PI)/i))+e}return f*Math.pow(2,-10*(g-=1))*Math.sin((g*j-h)*(2*Math.PI)/i)*0.5+k+e},backin:function(f,e,i,h,g){if(g==undefined){g=1.70158}return i*(f/=h)*f*((g+1)*f-g)+e},backout:function(f,e,i,h,g){if(g==undefined){g=1.70158}return i*((f=f/h-1)*f*((g+1)*f+g)+1)+e},backinout:function(f,e,i,h,g){if(g==undefined){g=1.70158}if((f/=h/2)<1){return i/2*(f*f*(((g*=(1.525))+1)*f-g))+e}return i/2*((f-=2)*f*(((g*=(1.525))+1)*f+g)+2)+e},bouncein:function(f,e,h,g){return h-a.bounceOut(g-f,0,h,g)+e},bounceout:function(f,e,h,g){if((f/=g)<(1/2.75)){return h*(7.5625*f*f)+e}else{if(f<(2/2.75)){return h*(7.5625*(f-=(1.5/2.75))*f+0.75)+e}else{if(f<(2.5/2.75)){return h*(7.5625*(f-=(2.25/2.75))*f+0.9375)+e}else{return h*(7.5625*(f-=(2.625/2.75))*f+0.984375)+e}}}},bounceinout:function(f,e,h,g){if(f<g/2){return a.bounceIn(f*2,0,h,g)*0.5+e}return a.bounceOut(f*2-g,0,h,g)*0.5+h*0.5+e}};return a})();
  /*  tween.js */  var Tween=function(){var a={};var c=true;var b={init:function(){return b},busy:function(){var e=false;for(var d in a){e=true;break}return e},to:function(g,e,p){var f=new Date().valueOf();var d={};var q={from:{},to:{},colors:{},node:g,t0:f,t1:f+e*1000,dur:e*1000};var o="linear";for(var j in p){if(j=="easing"){var h=p[j].toLowerCase();if(h in Easing){o=h}continue}else{if(j=="delay"){var m=(p[j]||0)*1000;q.t0+=m;q.t1+=m;continue}}if(Colors.validate(p[j])){q.colors[j]=[Colors.decode(g.data[j]),Colors.decode(p[j]),p[j]];d[j]=true}else{q.from[j]=(g.data[j]!=undefined)?g.data[j]:p[j];q.to[j]=p[j];d[j]=true}}q.ease=Easing[o];if(a[g._id]===undefined){a[g._id]=[]}a[g._id].push(q);if(a.length>1){for(var l=a.length-2;l>=0;l++){var n=a[l];for(var j in n.to){if(j in d){delete n.to[j]}else{d[j]=true}}for(var j in n.colors){if(j in d){delete n.colors[j]}else{d[j]=true}}if($.isEmptyObject(n.colors)&&$.isEmptyObject(n.to)){a.splice(l,1)}}}c=false},interpolate:function(e,h,i,g){g=(g||"").toLowerCase();var d=Easing.linear;if(g in Easing){d=Easing[g]}var f=d(e,0,1,1);if(Colors.validate(h)&&Colors.validate(i)){return lerpRGB(f,h,i)}else{if(!isNaN(h)){return lerpNumber(f,h,i)}else{if(typeof h=="string"){return(f<0.5)?h:i}}}},tick:function(){var f=true;for(var d in a){f=false;break}if(f){return}var e=new Date().valueOf();$.each(a,function(i,h){var g=false;$.each(h,function(p,t){var o=t.ease((e-t.t0),0,1,t.dur);o=Math.min(1,o);var r=t.from;var s=t.to;var j=t.colors;var l=t.node.data;var m=(o==1);for(var n in s){switch(typeof s[n]){case"number":l[n]=lerpNumber(o,r[n],s[n]);if(n=="alpha"){l[n]=Math.max(0,Math.min(1,l[n]))}break;case"string":if(m){l[n]=s[n]}break}}for(var n in j){if(m){l[n]=j[n][2]}else{var q=lerpRGB(o,j[n][0],j[n][1]);l[n]=Colors.encode(q)}}if(m){t.completed=true;g=true}});if(g){a[i]=$.map(h,function(j){if(!j.completed){return j}});if(a[i].length==0){delete a[i]}}});c=$.isEmptyObject(a);return c}};return b.init()};var lerpNumber=function(a,c,b){return c+a*(b-c)};var lerpRGB=function(b,d,c){b=Math.max(Math.min(b,1),0);var a={};$.each("rgba".split(""),function(e,f){a[f]=Math.round(d[f]+b*(c[f]-d[f]))});return a};

  arbor = (typeof(arbor)!=='undefined') ? arbor : {}
  $.extend(arbor, {
    // not really user-serviceable; use the ParticleSystem’s .tween* methods instead
    Tween:Tween,

    // immutable object with useful methods
    colors:{
      CSS:Colors.CSS,           // dictionary: {colorname:#fef2e2,...}
      validate:Colors.validate, // ƒ(str) -> t/f
      decode:Colors.decode,     // ƒ(hexString_or_cssColor) -> {r,g,b,a}
      encode:Colors.encode,     // ƒ({r,g,b,a}) -> hexOrRgbaString
      blend:Colors.blend        // ƒ(color, opacity) -> rgbaString
    }
  })

})(this.jQuery);

jiant.declare("jiantVisualizer", {
    visualize: 
    function($, app) {

  var id = "jiant_gr_vis";
  if (! $(id)[0]) {
    $("body").append('<div style="border: 1px solid green; width: 100%; height: 100%; position: absolute; left: 0; top: 0">' +
      '<canvas id="' + id + '" width="' + $(window).width() + '" height="' + $(window).height() + '"></canvas></div>');
  }

  var Renderer = function(canvas){
      var canvas = $(canvas).get(0)
      var ctx = canvas.getContext("2d");
      var particleSystem

      var that = {
        init:function(system){
          //
          // the particle system will call the init function once, right before the
          // first frame is to be drawn. it's a good place to set up the canvas and
          // to pass the canvas size to the particle system
          //
          // save a reference to the particle system for use in the .redraw() loop
          particleSystem = system

          // inform the system of the screen dimensions so it can map coords for us.
          // if the canvas is ever resized, screenSize should be called again with
          // the new dimensions
          particleSystem.screenSize(canvas.width, canvas.height)
          particleSystem.screenPadding(80) // leave an extra 80px of whitespace per side

          // set up some event handlers to allow for node-dragging
          that.initMouseHandling()
        },

        redraw:function(){
          //
          // redraw will be called repeatedly during the run whenever the node positions
          // change. the new positions for the nodes can be accessed by looking at the
          // .p attribute of a given node. however the p.x & p.y values are in the coordinates
          // of the particle system rather than the screen. you can either map them to
          // the screen yourself, or use the convenience iterators .eachNode (and .eachEdge)
          // which allow you to step through the actual node objects but also pass an
          // x,y point in the screen's coordinate system
          //
          ctx.fillStyle = "white"
          ctx.fillRect(0,0, canvas.width, canvas.height)

          particleSystem.eachEdge(function(edge, pt1, pt2){
            // edge: {source:Node, target:Node, length:#, data:{}}
            // pt1:  {x:#, y:#}  source position in screen coords
            // pt2:  {x:#, y:#}  target position in screen coords

            if (edge.source.data.visible && edge.target.data.visible) {
            // draw a line from pt1 to pt2
            ctx.strokeStyle = "rgba(0,0,0, .333)"
            ctx.lineWidth = 1
            ctx.beginPath()
            ctx.moveTo(pt1.x, pt1.y)
            ctx.lineTo(pt2.x, pt2.y)
            ctx.stroke()
            }
          })

          particleSystem.eachNode(function(node, pt){
            if (node.data.visible) {
              ctx.font = node.data.font ? node.data.font : "bold 11px Arial"
              ctx.textAlign = "center"
              ctx.fillStyle = node.data.color ? node.data.color : "#888";
              ctx.fillText(node.data.label||"", pt.x, pt.y+4)
            }
          })
        },

        initMouseHandling:function(){
          // no-nonsense drag and drop (thanks springy.js)
          var dragged = null;

          // set up a handler object that will initially listen for mousedowns then
          // for moves and mouseups while dragging
          var handler = {
            clicked:function(e){
              var pos = $(canvas).offset();
              _mouseP = arbor.Point(e.pageX-pos.left, e.pageY-pos.top)
              dragged = particleSystem.nearest(_mouseP);

              if (dragged && dragged.node !== null){
                // while we're dragging, don't let physics move the node
                dragged.node.fixed = true
              }

              $(canvas).bind('mousemove', handler.dragged)
              $(window).bind('mouseup', handler.dropped)

              return false
            },
            dragged:function(e){
              var pos = $(canvas).offset();
              var s = arbor.Point(e.pageX-pos.left, e.pageY-pos.top)

              if (dragged && dragged.node !== null){
                var p = particleSystem.fromScreen(s)
                dragged.node.p = p
              }

              return false
            },

            dropped:function(e){
              if (dragged===null || dragged.node===undefined) return
              if (dragged.node !== null) dragged.node.fixed = false
              dragged.node.tempMass = 1000
              dragged = null
              $(canvas).unbind('mousemove', handler.dragged)
              $(window).unbind('mouseup', handler.dropped)
              _mouseP = null
              return false
            }
          }

          // start listening
          $(canvas).mousedown(handler.clicked);

        }

      }
      return that
    }

  var sections = {
    "states" : "#23F",
    "events" : "#382",
    "ajax" : "#D66",
    "models" : "#F39",
    "views" : "B59",
    "templates" : "#297",
    "logic" : "#73E"};
  //arbor.etc.arbor_path("https://raw.github.com/vecnas/jiant/master/");
  var sys = arbor.ParticleSystem(1000, 600, 0.5);
  sys.parameters({gravity:true});
  sys.renderer = Renderer("#jiant_gr_vis");
//  app = pm.ldsClient;
  var root = sys.addNode(app.id, {label: app.id, sourceLabel: app.id, hlLabel: app.id, visible: true});
  $.each(app, function(key, content) {
    var color = sections[key];
    if (color) {
      var obj = {label: key, color: color, font: "bold 13px Arial", visible: true};
      obj.sourceFont = obj.font;
      obj.sourceLabel = obj.label;
      obj.hlLabel = obj.label;
      var section = sys.addNode(key, obj);
      sys.addEdge(root, section);
      $.each(content, function(subKey, subContent) {
        var obj = {label: subKey + ($.isFunction(subContent) ? "()" : ""), color: color, font: "bold 11px Arial", visible: true, dynamic: true};
        obj.sourceFont = obj.font;
        obj.sourceLabel = obj.label;
        var subSection = sys.addNode(key + ":" + subKey, obj);
        sys.addEdge(section, subSection);
        if ($.isFunction(subContent)) {
          obj.hlLabel = makeFunctionSignature(subKey, subContent);
        } else {
          obj.hlLabel = obj.label;
          $.each(subContent._jiantSpec ? subContent._jiantSpec : subContent, function(subSubKey, subSubContent) {
            var obj = {label: subSubKey + ($.isFunction(subSubContent) ? "()" : ""), color: color, font: "10px Arial",
              visible: false, dynamic: false};
            obj.sourceFont = obj.font;
            obj.sourceLabel = obj.label;
            if ($.isFunction(subSubContent)) {
              obj.hlLabel = makeFunctionSignature(subSubKey, subSubContent);
            } else {
              obj.hlLabel = obj.label;
            }
            var subSubSection = sys.addNode(key + ":" + subKey + ":" + subSubKey, obj);
            sys.addEdge(subSection, subSubSection);
          });
        }
      });
    } else {

    }
  });
  var lastNearest;
  $("#jiant_gr_vis").mousemove(function(evt) {
    var nearest = sys.nearest({x: evt.offsetX, y: evt.offsetY}).node;
    if (lastNearest && lastNearest != nearest) {
      lastNearest.data.font = lastNearest.data.sourceFont;
      lastNearest.data.label = lastNearest.data.sourceLabel;
      if (lastNearest.data.dynamic) {
        $.each(sys.getEdgesFrom(lastNearest), function(idx, edge) {
          edge.target.data.visible = false;
        });
      }
    }
    nearest.data.font = "bold 26px Arial";
    nearest.data.label = nearest.data.hlLabel;
    if (nearest.data.dynamic) {
      $.each(sys.getEdgesFrom(nearest), function(idx, edge) {
        edge.target.data.visible = true;
      });
      $.each(sys.getEdgesTo(nearest), function(idx, edge) {
        edge.target.data.visible = true;
      });
    }
    lastNearest = nearest;
  });

  function makeFunctionSignature(key, fnBody) {
    var s = key + "(",
        params = getParamNames(fnBody);
    params && $.each(params, function(idx, key) {
      s += key;
//      idx < params.length - 1 &&
      (s += ", ");
    });
    s += "cb)";
    return s;
  }

  function getParamNames(func) {
//    jiant.logInfo(func.params);
//    var funStr = func.toString();
//    return funStr.slice(funStr.indexOf('(')+1, funStr.indexOf(')')).match(/([^\s,]+)/g);
    return func._jiantSpec;
  }
}

  });
