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

const _xrData = {
    'CHI': {
        bar: [
            {"type":"System Design","amount":33},
            {"type":"Technology","amount":14},
            {"type":"Methods","amount":5},
            {"type":"User Study","amount":32},
            {"type":"Platform","amount":6},
            {"type":"Survey","amount":0},
        ],
        sink: [
            ['teleoperation', 10],
            ['healthcare', 3],
            ['immersive\nlearning', 1],
            ['social\ninteraction', 20],
            ['collaborative\ninteraction', 19],
            ['collaborative\ndesign', 5],
            ['immersive\nvisualization', 3],
            ['immersive\ncollaboration', 30],
        ],
    },
    'UIST': {
        bar: [
            {"type":"System Design","amount":42},
            {"type":"Technology","amount":11},
            {"type":"Methods","amount":4},
            {"type":"User Study","amount":18},
            {"type":"Platform","amount":11},
            {"type":"Survey","amount":3},
        ],
        sink: [
            ['teleoperation', 2],
            ['healthcare', 0],
            ['immersive\nlearning', 0],
            ['social\ninteraction', 1],
            ['collaborative\ninteraction', 10],
            ['collaborative\ndesign', 5],
            ['immersive\nvisualization', 1],
            ['immersive\ncollaboration', 13],
        ],
    },
    'SIGGRAPH': {
        bar: [
            {"type":"System Design","amount":15},
            {"type":"Technology","amount":25},
            {"type":"Methods","amount":5},
            {"type":"User Study","amount":7},
            {"type":"Platform","amount":7},
            {"type":"Survey","amount":7},
        ],
        sink: [
            ['teleoperation', 2],
            ['healthcare', 0],
            ['immersive\nlearning', 0],
            ['social\ninteraction', 3],
            ['collaborative\ninteraction', 3],
            ['collaborative\ndesign', 1],
            ['immersive\nvisualization', 3],
            ['immersive\ncollaboration', 11],
        ]
    },
    'IEEE VR': {
        bar: [
            {"type":"System Design","amount":15},
            {"type":"Technology","amount":25},
            {"type":"Methods","amount":5},
            {"type":"User Study","amount":7},
            {"type":"Platform","amount":7},
            {"type":"Survey","amount":7},
        ],
        sink: [
            ['teleoperation', 6],
            ['healthcare', 6],
            ['immersive\nlearning', 11],
            ['social\ninteraction', 13],
            ['collaborative\ninteraction', 19],
            ['collaborative\ndesign', 3],
            ['immersive\nvisualization', 9],
            ['immersive\ncollaboration', 22],
        ]
    },
    'ISMAR': {
        bar: [
            {"type":"System Design","amount":15},
            {"type":"Technology","amount":25},
            {"type":"Methods","amount":5},
            {"type":"User Study","amount":7},
            {"type":"Platform","amount":7},
            {"type":"Survey","amount":7},
        ],
        sink: [
            ['teleoperation', 0],
            ['healthcare', 0],
            ['immersive\nlearning', 0],
            ['social\ninteraction', 4],
            ['collaborative\ninteraction', 2],
            ['collaborative\ndesign', 4],
            ['immersive\nvisualization', 0],
            ['immersive\ncollaboration', 11],
        ]
    },
    'AH': {
        bar: [
            {"type":"System Design","amount":15},
            {"type":"Technology","amount":25},
            {"type":"Methods","amount":5},
            {"type":"User Study","amount":7},
            {"type":"Platform","amount":7},
            {"type":"Survey","amount":7},
        ],
        sink: [
            ['teleoperation', 4],
            ['healthcare', 3],
            ['immersive\nlearning', 2],
            ['social\ninteraction', 3],
            ['collaborative\ninteraction', 5],
            ['collaborative\ndesign', 0],
            ['immersive\nvisualization', 0],
            ['immersive\ncollaboration', 4],
        ]
    },
    'VRST': {
        bar: [
            {"type":"System Design","amount":18},
            {"type":"Technology","amount":4},
            {"type":"Methods","amount":5},
            {"type":"User Study","amount":9},
            {"type":"Platform","amount":3},
            {"type":"Survey","amount":1},
        ],
        sink: [
            ['teleoperation', 1],
            ['healthcare', 0],
            ['immersive\nlearning', 0],
            ['social\ninteraction', 1],
            ['collaborative\ninteraction', 2],
            ['collaborative\ndesign', 3],
            ['immersive\nvisualization', 4],
            ['immersive\ncollaboration', 5],
        ]
    },
    'TVCG': {
        bar: [
            {"type":"System Design","amount":22},
            {"type":"Technology","amount":2},
            {"type":"Methods","amount":3},
            {"type":"User Study","amount":3},
            {"type":"Platform","amount":1},
            {"type":"Survey","amount":0},
        ],
        sink: [
            ['teleoperation', 1],
            ['healthcare', 2],
            ['immersive\nlearning', 2],
            ['social\ninteraction', 3],
            ['collaborative\ninteraction', 8],
            ['collaborative\ndesign', 2],
            ['immersive\nvisualization', 6],
            ['immersive\ncollaboration', 16],
        ]
    },
    'Front Robot AI': {
        bar: [
            {"type":"System Design","amount":15},
            {"type":"Technology","amount":25},
            {"type":"Methods","amount":5},
            {"type":"User Study","amount":7},
            {"type":"Platform","amount":7},
            {"type":"Survey","amount":7},
        ],
        sink: [
            ['teleoperation', 0],
            ['healthcare', 0],
            ['immersive\nlearning', 0],
            ['social\ninteraction', 1],
            ['collaborative\ninteraction', 3],
            ['collaborative\ndesign', 0],
            ['immersive\nvisualization', 0],
            ['immersive\ncollaboration', 4],
        ]
    },
    'CSCW': {
        bar: [
            {"type":"System Design","amount":15},
            {"type":"Technology","amount":25},
            {"type":"Methods","amount":5},
            {"type":"User Study","amount":7},
            {"type":"Platform","amount":7},
            {"type":"Survey","amount":7},
        ],
        sink: [
            ['teleoperation', 1],
            ['healthcare', 2],
            ['immersive\nlearning', 4],
            ['social\ninteraction', 4],
            ['collaborative\ninteraction', 7],
            ['collaborative\ndesign', 9],
            ['immersive\nvisualization', 9],
            ['immersive\ncollaboration', 3],
        ]
    }
};


const today = new Date().getFullYear();

let trendData = {"nodes" : [], "links" : []};
publisherList.map((v, i) => trendData.nodes.push({"node":i,"name": v}));
paperTrends.map((v, i) => trendData.nodes.push({"node":publisherList.length+i,"name": v}));

for(const _xr in _xrData){
    _xrData[_xr].sink.map((v, k) => {
        trendData.links.push({"source":publisherList.indexOf(_xr),"target":publisherList.length+paperTrends.indexOf(v[0]),"value":v[1]})
    });
}
