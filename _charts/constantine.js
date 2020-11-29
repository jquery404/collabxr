const colorHolder = [
    '#BE5039',
    '#E76469',
    '#F1B1C3',
    '#EDA645',
    '#F8D85E',
    '#D1B0B3',
    '#8C99A6',
    '#ADD299',
    '#4FA490',
    '#3B7F9F',
];

const publisherList = [
    "CHI", 
    "IEEE VR", 
    "SIGGRAPH", 
    "ISMAR", 
    "CSCW", 
    "VRST", 
    "TVCG", 
    "UIST", 
    "Front Robot AI", 
    "AH"
];

const paperTrends = [
    'teleoperation',
    'healthcare',
    'immersive\nlearning',
    'social\ninteraction',
    'collaborative\ninteraction',
    'collaborative\ndesign',
    'immersive\nvisualization',
    'immersive\ncollaboration',
];

const barbarData = {
    "0": [
        {"type":"System Design","amount":15},
        {"type":"Technology","amount":25},
        {"type":"Methods","amount":5},
        {"type":"Survey","amount":7},
        {"type":"User Study","amount":7},
    ],
    "1": [
        {"type":"System Design","amount":55},
        {"type":"Technology","amount":25},
        {"type":"Methods","amount":5},
        {"type":"Survey","amount":7},
        {"type":"User Study","amount":7},
    ],
    "2": [
        {"type":"System Design","amount":15},
        {"type":"Technology","amount":10},
        {"type":"Methods","amount":0.5},
        {"type":"Platform","amount":7},
        {"type":"Survey","amount":7},
        {"type":"User Study","amount":7},
    ],
    "3": [
        {"type":"System Design","amount":5},
        {"type":"Technology","amount":1},
        {"type":"Methods","amount":5},
        {"type":"Survey","amount":7},
        {"type":"User Study","amount":7},
    ],
    "4": [
        {"type":"System Design","amount":8},
        {"type":"Technology","amount":5},
        {"type":"Methods","amount":5},
        {"type":"Survey","amount":7},
        {"type":"User Study","amount":7},
    ],
    "5": [
        {"type":"System Design","amount":55},
        {"type":"Technology","amount":25},
        {"type":"Methods","amount":5},
        {"type":"Survey","amount":7},
        {"type":"User Study","amount":7},
    ],
    "6": [
        {"type":"System Design","amount":55},
        {"type":"Technology","amount":25},
        {"type":"Methods","amount":15},
        {"type":"Survey","amount":7},
        {"type":"User Study","amount":7},
    ],
    "7": [
        {"type":"System Design","amount":25},
        {"type":"Technology","amount":25},
        {"type":"Methods","amount":5},
        {"type":"Survey","amount":7},
        {"type":"User Study","amount":7},
    ],
    "8": [
        {"type":"System Design","amount":0},
        {"type":"Technology","amount":1},
        {"type":"Methods","amount":1},
        {"type":"Survey","amount":1},
        {"type":"User Study","amount":5},
    ],
    "9": [
        {"type":"System Design","amount":25},
        {"type":"Technology","amount":35},
        {"type":"Methods","amount":5},
        {"type":"Survey","amount":7},
        {"type":"User Study","amount":7},
    ],
};

const today = new Date().getFullYear();


let sankApp = {"nodes" : [], "links" : []};

publisherList.map((v, i) => sankApp.nodes.push({"node":i,"name": v}));
paperTrends.map((v, i) => sankApp.nodes.push({"node":publisherList.length+i,"name": v}));


var _sinkin ={
0: [
['CHI', 'teleoperation', 9],
['CHI', 'healthcare', 4],
['CHI', 'immersive\nlearning', 2],
['CHI', 'social\ninteraction', 18],
['CHI', 'collaborative\ninteraction', 14],
['CHI', 'collaborative\ndesign', 5],
['CHI', 'immersive\nvisualization', 3],
['CHI', 'immersive\ncollaboration', 26],
],
1: [
['UIST', 'teleoperation', 4],
['UIST', 'healthcare', 1],
['UIST', 'immersive\nlearning', 5],
['UIST', 'social\ninteraction', 0],
['UIST', 'collaborative\ninteraction', 4],
['UIST', 'collaborative\ndesign', 0],
['UIST', 'immersive\nvisualization', 0],
['UIST', 'immersive\ncollaboration', 6],
],

2: [
['SIGGRAPH', 'teleoperation', 2],
['SIGGRAPH', 'healthcare', 0],
['SIGGRAPH', 'immersive\nlearning', 0],
['SIGGRAPH', 'social\ninteraction', 3],
['SIGGRAPH', 'collaborative\ninteraction', 3],
['SIGGRAPH', 'collaborative\ndesign', 1],
['SIGGRAPH', 'immersive\nvisualization', 3],
['SIGGRAPH', 'immersive\ncollaboration', 11],
],

3: [
['IEEE VR', 'teleoperation', 1],
['IEEE VR', 'healthcare', 2],
['IEEE VR', 'immersive\nlearning', 0],
['IEEE VR', 'social\ninteraction', 2],
['IEEE VR', 'collaborative\ninteraction', 0],
['IEEE VR', 'collaborative\ndesign', 3],
['IEEE VR', 'immersive\nvisualization', 0],
['IEEE VR', 'immersive\ncollaboration', 5],
],

4: [
['ISMAR', 'teleoperation', 0],
['ISMAR', 'healthcare', 0],
['ISMAR', 'immersive\nlearning', 0],
['ISMAR', 'social\ninteraction', 4],
['ISMAR', 'collaborative\ninteraction', 2],
['ISMAR', 'collaborative\ndesign', 4],
['ISMAR', 'immersive\nvisualization', 0],
['ISMAR', 'immersive\ncollaboration', 11],
],

5: [
['AH', 'teleoperation', 4],
['AH', 'healthcare', 3],
['AH', 'immersive\nlearning', 2],
['AH', 'social\ninteraction', 3],
['AH', 'collaborative\ninteraction', 5],
['AH', 'collaborative\ndesign', 0],
['AH', 'immersive\nvisualization', 0],
['AH', 'immersive\ncollaboration', 4],
],

6: [
['VRST', 'teleoperation', 1],
['VRST', 'healthcare', 0],
['VRST', 'immersive\nlearning', 0],
['VRST', 'social\ninteraction', 1],
['VRST', 'collaborative\ninteraction', 2],
['VRST', 'collaborative\ndesign', 3],
['VRST', 'immersive\nvisualization', 4],
['VRST', 'immersive\ncollaboration', 5],
],

7: [
['TVCG', 'teleoperation', 10],
['TVCG', 'healthcare', 2],
['TVCG', 'immersive\nlearning', 3],
['TVCG', 'social\ninteraction', 11],
['TVCG', 'collaborative\ninteraction', 2],
['TVCG', 'collaborative\ndesign', 2],
['TVCG', 'immersive\nvisualization', 2],
['TVCG', 'immersive\ncollaboration', 12],
],

8: [
['Front Robot AI', 'teleoperation', 0],
['Front Robot AI', 'healthcare', 0],
['Front Robot AI', 'immersive\nlearning', 0],
['Front Robot AI', 'social\ninteraction', 1],
['Front Robot AI', 'collaborative\ninteraction', 3],
['Front Robot AI', 'collaborative\ndesign', 0],
['Front Robot AI', 'immersive\nvisualization', 0],
['Front Robot AI', 'immersive\ncollaboration', 4],
],

9: [
['CSCW', 'teleoperation', 1],
['CSCW', 'healthcare', 2],
['CSCW', 'immersive\nlearning', 4],
['CSCW', 'social\ninteraction', 4],
['CSCW', 'collaborative\ninteraction', 7],
['CSCW', 'collaborative\ndesign', 9],
['CSCW', 'immersive\nvisualization', 9],
['CSCW', 'immersive\ncollaboration', 3],
]
};


for(const _s in _sinkin){
    _sinkin[_s].map((v, k) => sankApp.links.push({"source":parseInt(_s),"target":publisherList.length+paperTrends.indexOf(v[1]),"value":v[2]},))
}

console.log(sankApp);