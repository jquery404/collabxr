const colorHolder = [
    '#BE5039',
    '#EE7786',
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
        {"type":"System Design","amount":33},
        {"type":"Technology","amount":14},
        {"type":"Methods","amount":5},
        {"type":"User Study","amount":32},
        {"type":"Platform","amount":6},
        {"type":"Survey","amount":0},
    ],
    "1": [
        {"type":"System Design","amount":42},
        {"type":"Technology","amount":11},
        {"type":"Methods","amount":4},
        {"type":"User Study","amount":18},
        {"type":"Platform","amount":11},
        {"type":"Survey","amount":3},
    ],
    "2": [
        {"type":"System Design","amount":15},
        {"type":"Technology","amount":25},
        {"type":"Methods","amount":5},
        {"type":"User Study","amount":7},
        {"type":"Platform","amount":7},
        {"type":"Survey","amount":7},
    ],
    "3": [
        {"type":"System Design","amount":15},
        {"type":"Technology","amount":25},
        {"type":"Methods","amount":5},
        {"type":"User Study","amount":7},
        {"type":"Platform","amount":7},
        {"type":"Survey","amount":7},
    ],
    "4": [
        {"type":"System Design","amount":15},
        {"type":"Technology","amount":25},
        {"type":"Methods","amount":5},
        {"type":"User Study","amount":7},
        {"type":"Platform","amount":7},
        {"type":"Survey","amount":7},
    ],
    "5": [
        {"type":"System Design","amount":15},
        {"type":"Technology","amount":25},
        {"type":"Methods","amount":5},
        {"type":"User Study","amount":7},
        {"type":"Platform","amount":7},
        {"type":"Survey","amount":7},
    ],
    "6": [
        {"type":"System Design","amount":15},
        {"type":"Technology","amount":25},
        {"type":"Methods","amount":5},
        {"type":"User Study","amount":7},
        {"type":"Platform","amount":7},
        {"type":"Survey","amount":7},
    ],
    "7": [
        {"type":"System Design","amount":22},
        {"type":"Technology","amount":2},
        {"type":"Methods","amount":3},
        {"type":"User Study","amount":3},
        {"type":"Platform","amount":1},
        {"type":"Survey","amount":0},
    ],
    "8": [
        {"type":"System Design","amount":15},
        {"type":"Technology","amount":25},
        {"type":"Methods","amount":5},
        {"type":"User Study","amount":7},
        {"type":"Platform","amount":7},
        {"type":"Survey","amount":7},
    ],
    "9": [
        {"type":"System Design","amount":15},
        {"type":"Technology","amount":25},
        {"type":"Methods","amount":5},
        {"type":"User Study","amount":7},
        {"type":"Platform","amount":7},
        {"type":"Survey","amount":7},
    ],
};


const _sinkin = {
    0: [
        ['CHI', 'teleoperation', 10],
        ['CHI', 'healthcare', 3],
        ['CHI', 'immersive\nlearning', 1],
        ['CHI', 'social\ninteraction', 20],
        ['CHI', 'collaborative\ninteraction', 19],
        ['CHI', 'collaborative\ndesign', 5],
        ['CHI', 'immersive\nvisualization', 3],
        ['CHI', 'immersive\ncollaboration', 30],
    ],
    1: [
        ['UIST', 'teleoperation', 2],
        ['UIST', 'healthcare', 0],
        ['UIST', 'immersive\nlearning', 0],
        ['UIST', 'social\ninteraction', 1],
        ['UIST', 'collaborative\ninteraction', 10],
        ['UIST', 'collaborative\ndesign', 5],
        ['UIST', 'immersive\nvisualization', 1],
        ['UIST', 'immersive\ncollaboration', 13],
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
        ['IEEE VR', 'teleoperation', 6],
        ['IEEE VR', 'healthcare', 6],
        ['IEEE VR', 'immersive\nlearning', 11],
        ['IEEE VR', 'social\ninteraction', 13],
        ['IEEE VR', 'collaborative\ninteraction', 19],
        ['IEEE VR', 'collaborative\ndesign', 3],
        ['IEEE VR', 'immersive\nvisualization', 9],
        ['IEEE VR', 'immersive\ncollaboration', 22],
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

const today = new Date().getFullYear();

let trendData = {"nodes" : [], "links" : []};
publisherList.map((v, i) => trendData.nodes.push({"node":i,"name": v}));
paperTrends.map((v, i) => trendData.nodes.push({"node":publisherList.length+i,"name": v}));

for(const _s in _sinkin){
    _sinkin[_s].map((v, k) => trendData.links.push({"source":parseInt(_s),"target":publisherList.length+paperTrends.indexOf(v[1]),"value":v[2]}))
}
