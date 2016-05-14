var module={"info":[{"name":"core-extensions","checked":0,"maxSize":"95.1KB","minSize":"51.7KB","rule":["core"],"info":"Cocos2d Core extensions"},{"name":"core-webgl","checked":0,"maxSize":"81.9KB","minSize":"42.7KB","rule":["core","core-extensions"],"info":"Cocos2d WebGL support"},{"name":"core","checked":1,"maxSize":"423.0KB","minSize":"239.8KB","rule":[],"info":"Engine core modules, includes Director, Node, Scene, Layer, Sprite, LabelTTF, EventManger, Scheduler and Texture2D. The default render is canvas."},{"name":"debugger","checked":1,"maxSize":"19.9KB","minSize":"17.3KB","rule":["core"],"info":"Log system and debug informations"},{"name":"kazmath","checked":0,"maxSize":"54.8KB","minSize":"30.4KB","rule":["core","core-webgl"],"info":"Math lib for webgl"},{"name":"shaders","checked":0,"maxSize":"36.0KB","minSize":"24.1KB","rule":["core","core-webgl","kazmath"],"info":"Shaders"},{"name":"render-texture","checked":0,"maxSize":"19.0KB","minSize":"10.9KB","rule":["core"],"info":"RenderTexture node for custom rendering"},{"name":"labels","checked":0,"maxSize":"42.9KB","minSize":"19.5KB","rule":["core","core-extensions"],"info":"Label nodes including LabelBMFont, LabelAtlas"},{"name":"motion-streak","checked":0,"maxSize":"12.2KB","minSize":"6.3KB","rule":["core","core-webgl","shaders","kazmath","labels"],"info":"MotionStreak which can manage a ribbon based on its motion"},{"name":"node-grid","checked":0,"maxSize":"2.5KB","minSize":"1.3KB","rule":["core","core-webgl"],"info":"Base node of effects"},{"name":"shape-nodes","checked":0,"maxSize":"33.9KB","minSize":"16.7KB","rule":["core"],"info":"DrawNode can be used to render lines, polygons, curves, etc"},{"name":"clipping-nodes","checked":0,"maxSize":"10.7KB","minSize":"6.0KB","rule":["core","shape-nodes"],"info":"ClippingNode can clip hosted nodes with shape or texture as stencil"},{"name":"effects","checked":0,"maxSize":"21.7KB","minSize":"12.3KB","rule":["core","core-webgl","node-grid"],"info":"Some effects"},{"name":"actions","checked":1,"maxSize":"126.8KB","minSize":"76.0KB","rule":["core"],"info":"Configurable actions for animating nodes with position, scale, etc"},{"name":"actions3d","checked":0,"maxSize":"46.4KB","minSize":"23.0KB","rule":["core","core-webgl","kazmath","shaders","actions","effects","render-texture"],"info":"Effects that can be applied to nodes, like page turn, shake, wave, etc"},{"name":"progress-timer","checked":0,"maxSize":"28.6KB","minSize":"15.3KB","rule":["core","actions"],"info":"ProgressTimer node which can transform a node into a progression bar"},{"name":"transitions","checked":0,"maxSize":"38.2KB","minSize":"25.1KB","rule":["core","actions","render-texture","progress-timer"],"info":"Scene transition effects"},{"name":"compression","checked":0,"maxSize":"41.6KB","minSize":"31.6KB","rule":["core"],"info":"Compression of tilemap and particle"},{"name":"particle","checked":0,"maxSize":"128.2KB","minSize":"67.7KB","rule":["core","compression"],"info":"ParticleSystem node and built in particle effects"},{"name":"text-input","checked":0,"maxSize":"16.6KB","minSize":"9.7KB","rule":["core"],"info":"Nodes for simple text inputing"},{"name":"menus","checked":1,"maxSize":"39.3KB","minSize":"20.0KB","rule":["core","actions"],"info":"Menu and MenuItem nodes for creating game menu"},{"name":"tilemap","checked":0,"maxSize":"66.1KB","minSize":"35.9KB","rule":["core","compression"],"info":"TMX file parser for creating tile map layers"},{"name":"parallax","checked":0,"maxSize":"3.4KB","minSize":"2.0KB","rule":["core"],"info":"Parallax effect which can be applied to layers"},{"name":"audio","checked":1,"maxSize":"30.7KB","minSize":"14.0KB","rule":["core"],"info":"Audio system"},{"name":"gui","checked":0,"maxSize":"166.4KB","minSize":"94.8KB","rule":["core","clipping-nodes","render-texture","actions","progress-timer"],"info":"Another GUI extension with a set of useful widgets"},{"name":"ccbreader","checked":0,"maxSize":"137.0KB","minSize":"68.9KB","rule":["core","audio","gui","menus","particle","actions","labels"],"info":"CocosBuilder editor support"},{"name":"editbox","checked":0,"maxSize":"27.4KB","minSize":"16.9KB","rule":["core","gui"],"info":"Edit Box for more complex text inputing"},{"name":"ccui","checked":0,"maxSize":"381.1KB","minSize":"215.9KB","rule":["core","gui","actions","labels","text-input","clipping-nodes"],"info":"Cocos UI widgets with layout support"},{"name":"cocostudio","checked":0,"maxSize":"330.0KB","minSize":"163.8KB","rule":["core","tilemap","particle","shape-nodes","ccui"],"info":"CocoStudio editor support"},{"name":"pluginx","checked":0,"maxSize":"3.4KB","minSize":"1.9KB","rule":["core"],"info":"Social network API plugins"},{"name":"physics","checked":0,"maxSize":"13.0KB","minSize":"5.2KB","rule":["core","shape-nodes"],"info":"Physics node for Box2d and Chipmunk"},{"name":"socketio","checked":0,"maxSize":"44.8KB","minSize":"44.4KB","rule":[],"info":"ScoketIO library support"},{"name":"box2d","checked":0,"maxSize":"454.2KB","minSize":"232.9KB","rule":["core","physics"],"info":"Built in box2d physics engine support"},{"name":"chipmunk","checked":0,"maxSize":"119.4KB","minSize":"56.3KB","rule":["core","physics"],"info":"Built in Chipmunk physics engine support"},{"name":"spine","checked":0,"maxSize":"84.8KB","minSize":"39.8KB","rule":["core"],"info":"The spine support library"},{"name":"ccpool","checked":0,"maxSize":"2.0KB","minSize":"0.9KB","rule":["core"],"info":"Sprite recycling pool"}]};
var hiddenList={"core-webgl":0,"core-extensions":1,"kazmath":1,"shaders":1,"node-grid":1,"compression":1,"effects":1,"physics":1};
var _sort=["core-webgl","core","core-extensions","debugger","actions","audio","menus","kazmath","shaders","render-texture","labels","motion-streak","node-grid","shape-nodes","clipping-nodes","effects","actions3d","progress-timer","transitions","compression","particle","text-input","tilemap","parallax","gui","ccbreader","editbox","ccui","cocostudio","ccpool","pluginx","physics","socketio","box2d","chipmunk","spine"];