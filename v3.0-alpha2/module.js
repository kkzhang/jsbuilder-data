var module = {"info": [
    {"name": "core-webgl", "minSize": "43.0KB", "maxSize": "75.4KB", "checked": 0, "rule": ["core", "core-extensions"], "info": "Cocos2d WebGL support"},
    {"name": "core", "minSize": "226.7KB", "maxSize": "374.2KB", "checked": 1, "rule": [], "info": "Engine core modules, includes Director, Node, Scene, Layer, Sprite, LabelTTF, EventManger, Scheduler and Texture2D. The default render is canvas."},
    {"name": "core-extensions", "minSize": "57.0KB", "maxSize": "97.0KB", "checked": 0, "rule": ["core"], "info": "Cocos2d Core extensions"},
    {"name": "debugger", "minSize": "16.8KB", "maxSize": "18.2KB", "checked": 1, "rule": ["core"], "info": "Log system and debug informations"},
    {"name": "actions", "minSize": "52.7KB", "maxSize": "79.3KB", "checked": 1, "rule": ["core"], "info": "Configurable actions for animating nodes with position, scale, etc"},
    {"name": "labels", "minSize": "19.1KB", "maxSize": "38.3KB", "checked": 0, "rule": ["core"], "info": "Label nodes including LabelBMFont, LabelAtlas"},
    {"name": "audio", "minSize": "13.3KB", "maxSize": "24.0KB", "checked": 1, "rule": ["core"], "info": "Audio system."},
    {"name": "menus", "minSize": "19.9KB", "maxSize": "35.4KB", "checked": 1, "rule": ["core", "actions"], "info": "Menu and MenuItem nodes for creating game menu."},
    {"name": "transitions", "minSize": "23.9KB", "maxSize": "33.3KB", "checked": 0, "rule": ["core", "actions", "render-texture", "progress-timer"], "info": "Scene transition effects"},
    {"name": "ccui", "minSize": "177.1KB", "maxSize": "296.1KB", "checked": 0, "rule": ["core", "gui", "actions", "labels", "text-input", "clipping-nodes"], "info": "Cocos UI widgets with layout support"},
    {"name": "shape-nodes", "minSize": "16.7KB", "maxSize": "31.9KB", "checked": 0, "rule": ["core"], "info": "DrawNode can be used to render lines, polygons, curves, etc"},
    {"name": "clipping-nodes", "minSize": "5.5KB", "maxSize": "8.7KB", "checked": 0, "rule": ["core", "shape-nodes"], "info": "ClippingNode can clip hosted nodes with shape or texture as stencil"},
    {"name": "particle", "minSize": "65.9KB", "maxSize": "118.5KB", "checked": 0, "rule": ["core", "compression"], "info": "ParticleSystem node and built in particle effects"},
    {"name": "progress-timer", "minSize": "15KB", "maxSize": "25.5KB", "checked": 0, "rule": ["core", "actions"], "info": "ProgressTimer node which can transform a node into a progression bar"},
    {"name": "actions3d", "minSize": "22.2KB", "maxSize": "40.6KB", "checked": 0, "rule": ["core","webgl", "core-webgl", "kazmath", "shaders", "actions", "effects", "render-texture"], "info": "Effects that can be applied to nodes, like page turn, shake, wave, etc"},
    {"name": "tilemap", "minSize": "34.6KB", "maxSize": "59.6KB", "checked": 0, "rule": ["core", "compression"], "info": "TMX file parser for creating tile map layers"},
    {"name": "parallax", "minSize": "2.0KB", "maxSize": "3.0KB", "checked": 0, "rule": ["core"], "info": "Parallax effect which can be applied to layers"},
    {"name": "render-texture", "minSize": "10.4KB", "maxSize": "17.1KB", "checked": 0, "rule": ["core"], "info": "RenderTexture node for custom rendering"},
    {"name": "text-input", "minSize": "9.6KB", "maxSize": "14.0KB", "checked": 0, "rule": ["core"], "info": "Nodes for simple text inputing"},
    {"name": "gui", "minSize": "92.4KB", "maxSize": "152.2KB", "checked": 0, "rule": ["core", "clipping-nodes", "render-texture", "actions", "progress-timer"], "info": "Another GUI extension with a set of useful widgets"},
    {"name": "editbox", "minSize": "16.0KB", "maxSize": "24.7KB", "checked": 0, "rule": ["core", "gui"], "info": "Edit Box for more complex text inputing"},
    {"name": "cocostudio", "minSize": "136.9KB", "maxSize": "248.3KB", "checked": 0, "rule": ["core", "tilemap", "particle", "shape-nodes", "ccui"], "info": "CocoStudio editor support"},
    {"name": "ccbreader", "minSize": "68.4KB", "maxSize": "123.3KB", "checked": 0, "rule": ["core", "audio", "gui", "menus", "particle", "actions", "labels"], "info": "CocosBuilder editor support"},
    {"name": "box2d", "minSize": "222.9KB", "maxSize": "441.5KB", "checked": 0, "rule": ["core", "physics"], "info": "Built in box2d physics engine support"},
    {"name": "chipmunk", "minSize": "55.6KB", "maxSize": "116.1KB", "checked": 0, "rule": ["core", "physics"], "info": "Built in Chipmunk physics engine support"},
    {"name": "socketio", "minSize": "44.2KB", "maxSize": "68.2KB", "checked": 0, "rule": [], "info": "ScoketIO library support"},
    {"name": "pluginx", "minSize": "15.7KB", "maxSize": "21.0KB", "checked": 0, "rule": ["core"], "info": "Social network API plugins"},
    {"name": "motion-streak", "minSize": "6.3KB", "maxSize": "11.6KB", "checked": 0, "rule": ["core", "webgl", "core-webgl", "shaders", "kazmath", "labels"], "info": "MotionStreak which can manage a ribbon based on its motion"},

    {"name": "kazmath", "minSize": "30.5KB", "maxSize": "52.7KB", "checked": 0, "rule": ["core"], "info": "Math lib for webgl"},
    {"name": "shaders", "minSize": "24.0KB", "maxSize": "33.0KB", "checked": 0, "rule": ["core", "kazmath"], "info": "Shaders"},
    {"name": "node-grid", "minSize": "1.3KB", "maxSize": "2.2KB", "checked": 0, "rule": ["core"], "info": "Base node of effects"},
    {"name": "effects", "minSize": "12.2KB", "maxSize": "19.7KB", "checked": 0, "rule": ["core", "node-grid"], "info": "Some effects"},
    {"name": "compression", "minSize": "31.3KB", "maxSize": "56.4KB", "checked": 0, "rule": ["core"], "info": "Compression of tilemap and particle"},
    {"name": "physics", "minSize": "5.1KB", "maxSize": "11.7KB", "checked": 0, "rule": ["core", "shape-nodes"], "info": "Physics node for Box2d and Chipmunk"}
]};

var hiddenList = {
    'core-webgl': 0,
    'core-extensions': 1,
    'kazmath': 1,
    'shaders': 1,
    'node-grid': 1,
    'compression': 1,
    'effects': 1,
    'physics': 1
};

var _sort = [
    "core-webgl",
    "core",
    "core-extensions",
    "debugger",
    "actions",
    "audio",
    "menus",
    "kazmath",
    "shaders",
    "render-texture",
    "labels",
    "motion-streak",
    "node-grid",
    "shape-nodes",
    "clipping-nodes",
    "effects",
    "actions3d",
    "progress-timer",
    "transitions",
    "compression",
    "particle",
    "text-input",
    "tilemap",
    "parallax",
    "gui",
    "ccbreader",
    "editbox",
    "ccui",
    "cocostudio",
    "pluginx",
    "physics",
    "socketio",
    "box2d",
    "chipmunk"
];