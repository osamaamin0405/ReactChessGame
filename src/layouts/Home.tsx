import React, { Component } from 'react'
import BoardPace from '../components/BoardPace'
const notionYKeys = ["A", "B", "C", "D", "E", "F", "G", "H"],
      notionXKeys = [1,2,3,4,5,6,7,8];
export default class Home extends Component {
  render() {
    let boards = [];
    const image = ["w", "b"]
    for(let i = 0; i <8; i++) {
      for(let j = 0; j < 8; j++) { 
        boards.push(
          <BoardPace 
            key={Date.now() * (i+1 + j)}
            width={80} 
            height={80}
            bg={image[(i+1) % 2]}
            index={{x: notionXKeys[i], y: notionYKeys[i]}}
          ></BoardPace>
        );
      }
    }

    return (
      <div className='boarder-container'>
        {
          boards
        }
      </div>
    );
  }
}
