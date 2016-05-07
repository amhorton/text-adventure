import { setExplanation } from 'domHelpers';
let adventure = window.adventure = {
    inventory : [
        { name : 'Memories', description : 'Your memories. There\'s no use for these' }
    ],
    makeExpSayDog () {
        setExplanation('DOG');
    }

};
