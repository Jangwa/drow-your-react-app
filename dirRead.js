const testFolder = './src/';
const fs = require('fs');
const readline = require('readline');
var lineReader = require('line-reader-sync');
var theTree = {name: 'ROOT', child: []};
const parentStack=[theTree];
const trackStack = ['theTree'];
var currentNode=[];
const LineReaderSync = require("line-reader-sync")
const fileProcess = (file) => {
  const lrs = new LineReaderSync(`./src/${file}`);
  while(true){
    var line = lrs.readline()
    if(line === null) {
      console.log("EOF");
      break;
    } else {
      var theLineToParse = line.split('-dc ');
      if(theLineToParse.length > 1) {
        console.log('a valid line==========>', line);
        theLineToParse = theLineToParse[1];
        if(theLineToParse.split('*/').length > 1)
        {
          theLineToParse = theLineToParse.split('*/')[0];
        }
        if(theLineToParse.split('-call-').length > 1) {
          theLineToParse = theLineToParse.split('-call-')[1].trim();
          let conditionAndName = theLineToParse.split(' ');
          let compName = conditionAndName[0];
          let condition = '';
          if(conditionAndName.length > 1)
          {
            conditionAndName.splice(0, 1);
            condition = conditionAndName.join(' ');
          }
          var vv={ compName, type: '__CALL_COMP', condition };
          parentStack[parentStack.length-1].child.push(vv);
        } else if(theLineToParse.split('-desc-').length > 1) {
          theLineToParse = theLineToParse.split('-desc-')[1];
          var vv={ type: '__DESC', descText: theLineToParse };
          parentStack[parentStack.length-1].child.push(vv);
        } else {
          if(trackStack[trackStack.length - 1] !== theLineToParse) {
            var vv={ compName: theLineToParse, child:[], type: '__BLOCK' };
            //console.log('PUSHING');
            parentStack[parentStack.length-1].child.push(vv);
            console.log('pushing---------------------------------------------', vv);
            parentStack.push(vv);
            trackStack.push(theLineToParse);
            //console.log(theLineToParse, '+++++++After push++++++', trackStack, 'A valid line');
          }else {
              //console.log('line', line);
              console.log('a valid line',line);
              parentStack.pop();
              trackStack.pop();
          }
        }
      }
    }
  }
}
var filesList = fs.readdirSync(testFolder)
for(let x in filesList) fileProcess(filesList[x]);
const nodes = [];
const links = [];
const actualNodes = parentStack[0].child;
// for(let i=0;i<actualNodes.length;i++){
//   nodes.push({
//     "name": actualNodes[i].compName,
//     "label": "component",
//     "id": actualNodes[i].compName,
//     "r": 20, 
//   });
// }
// for(let i=0;i<actualNodes.length;i++){
//   if (actualNodes[i].) {
//     links.push({
//       "source": 1,
//       "target": 2,
//       "type": "KNOWS",
//       "since": 2010
//     });
//   }
// }
console.log(JSON.stringify(theTree));

