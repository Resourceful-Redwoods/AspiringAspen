exports.cards = [{
  name: 'Bounty Hunter',
  type: 'Space Cowboy',
  power: 50,
  image: 'images/cowboys4.png',
  advantages: {
    'Space Cowboy': 0,
    'Space Samurai': 20,
    'Space Wizard': 0
  }
}, {
  name: 'Desperado',
  type: 'Space Cowboy',
  power: 30,
  image: 'images/cowboys3.png',
  advantages: {
    'Space Cowboy': 0,
    'Space Samurai': 20,
    'Space Wizard': 0
  }
}, {
  name: 'Sharp Shooter',
  type: 'Space Cowboy',
  power: 20,
  image: 'images/cowboys2.png',
  advantages: {
    'Space Cowboy': 0,
    'Space Samurai': 20,
    'Space Wizard': 0
  }
}, {
  name: 'Wrangler',
  type: 'Space Cowboy',
  power: 10,
  image: 'images/cowboys1.png',
  advantages: {
    'Space Cowboy': 0,
    'Space Samurai': 20,
    'Space Wizard': 0
  }
}, {
  name: 'Grand Master',
  type: 'Space Samurai',
  power: 50,
  image: 'images/samurai4.png',
  advantages: {
    'Space Cowboy': 0,
    'Space Samurai': 0,
    'Space Wizard': 20
  }
}, {
  name: 'Master',
  type: 'Space Samurai',
  power: 30,
  image: 'images/samurai3.png',
  advantages: {
    'Space Cowboy': 0,
    'Space Samurai': 0,
    'Space Wizard': 20
  }
}, {
  name: 'Journeyman',
  type: 'Space Samurai',
  power: 20,
  image: 'images/samurai2.png',
  advantages: {
    'Space Cowboy': 0,
    'Space Samurai': 0,
    'Space Wizard': 20
  }
}, {
  name: 'Apprentice',
  type: 'Space Samurai',
  power: 10,
  image: 'images/samurai1.png',
  advantages: {
    'Space Cowboy': 0,
    'Space Samurai': 0,
    'Space Wizard': 20
  }
}, {
  name: 'Warlock',
  type: 'Space Wizard',
  power: 50,
  image: 'images/wizard4.jpg',
  advantages: {
    'Space Cowboy': 20,
    'Space Samurai': 0,
    'Space Wizard': 0
  }
}, {
  name: 'Mystic',
  type: 'Space Wizard',
  power: 30,
  image: 'images/wizard3.jpg',
  advantages: {
    'Space Cowboy': 20,
    'Space Samurai': 0,
    'Space Wizard': 0
  }
}, {
  name: 'Scholar',
  type: 'Space Wizard',
  power: 20,
  image: 'images/wizard2.jpg',
  advantages: {
    'Space Cowboy': 20,
    'Space Samurai': 0,
    'Space Wizard': 0
  }
}, {
  name: 'Student',
  type: 'Space Wizard',
  power: 10,
  image: 'images/wizard1.jpg',
  advantages: {
    'Space Cowboy': 20,
    'Space Samurai': 0,
    'Space Wizard': 0
  }
}];

exports.environments = [{
  name: 'Desert Planet',
  affects: {
    'Space Cowboy': 10,
    'Space Samurai': 0,
    'Space Wizard': -10
  },
  image: 'images/desertplanet.png'
}, {
  name: 'Forest Planet',
  affects: {
    'Space Cowboy': -10,
    'Space Samurai': 10,
    'Space Wizard': 0
  },
  image: 'images/forestplanet.png'
}, {
  name: 'Metropolis Planet',
  affects: {
    'Space Cowboy': 0,
    'Space Samurai': -10,
    'Space Wizard': 10
  },
  image: 'images/metropolisplanet.png'
}, {
  name: 'Space Station',
  affects: {
    'Space Cowboy': 0,
    'Space Samurai': 0,
    'Space Wizard': 0
  },
  image: 'images/spacestation.png'
}];
