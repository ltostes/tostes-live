import Exploradora from '../../../assets/exploradora.svg?react';
import Explorador from '../../../assets/explorador.svg?react';

const ExploradoraIcon = ({ size, color }) => (
  <Exploradora 
    transform={`translate(${-size/2},${-size/2})`}
    width={size} 
    height={size} 
    fill={color} 
  />
);

const ExploradorIcon = ({ size, color }) => (
  <Explorador 
    transform={`translate(${-size/2},${-size/2})`}
    width={size} 
    height={size} 
    fill={color} 
  />
);

export function PlayerTile({style, isFemale}) {
    const size = 18

    if (isFemale) {
        return (
            <ExploradoraIcon 
            size={size} 
            color={style.fill}
            />
        )
    }
    return (
        <ExploradorIcon 
        size={size} 
        color={style.fill}
    />
    )
    
        
}
