import React from 'react';
import ReactDOM from 'react-dom';

const Card = (props) => {



  return (
    <div className={'cardFront hoverable center-block' + (this.state.isSelected ? 'selected' : '')} onClick={() => this.props.selectCard(this.props.card)}>
      <div className='cardFrontWrapper'>
        <img className='circle' src={this.props.card.imageUrl}></img>
        <div className='statsWrapper left-align'>
          <p>{this.props.card.name}</p>
          <ul>
            <li>Home Runs: {this.props.card.info['Home Runs']}</li>
            <li>Average: {this.props.card.info['Average']}</li>
            <li>Hits: {this.props.card.info['Hits']}</li>
            <li>RBI: {this.props.card.info['RBI']}</li>
            <li>Stolen Bases: {this.props.card.info['Stolen Bases']}</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Card;
