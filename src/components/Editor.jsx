import React, { useEffect, useRef } from 'react';
import CodeMirror from 'codemirror';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/theme/darcula.css';
import 'codemirror/lib/codemirror.css';
import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/edit/closebrackets';
import ACTIONS from '../Actions';
import '../App.css'

const Editor = ({socketRef, roomId, onCodeChange}) => {
  const textareaRef = useRef(null);
  useEffect(() => {
    async function init(){
      textareaRef.current = CodeMirror.fromTextArea(document.getElementById('realtimeEditor'), {
        mode: {name:'javascript', json: true},
        theme: 'darcula',
        autoCloseTags: true,
        autoCloseBrackets: true,
        lineNumbers: true,
      });


      textareaRef.current.on('change', (instance, changes) => {
        const {origin} = changes;
        const code = instance.getValue();
        onCodeChange(code);
        if(origin !== 'setValue') {
          socketRef.current.emit(ACTIONS.CODE_CHANGE, {
            roomId,
            code
          })
        }
        console.log('code', code);
      })

      // textareaRef.current.setValue(`console.log('hello)`);


  }
  init();
}, []);

  useEffect( () => {
    if(socketRef.current){
    socketRef.current.on(ACTIONS.CODE_CHANGE, ({code}) => {
      if(code !== null){
        textareaRef.current.setValue(code);
      }
    });
  }
  return () => {
    socketRef.current.off(ACTIONS.CODE_CHANGE);
  }
  }, [socketRef.current])

  return (
    <div>
      <textarea ref={textareaRef} id="realtimeEditor" />
    </div>
  );
};

export default Editor;





































// import React, { useEffect, useRef } from 'react';
// import CodeMirror from 'codemirror';
// import 'codemirror/mode/javascript/javascript';
// import 'codemirror/theme/darcula.css';
// import 'codemirror/lib/codemirror.css';
// import 'codemirror/addon/edit/closetag';
// import 'codemirror/addon/edit/closebrackets';
// import ACTIONS from '../Actions';

// const Editor = ({socketRef, roomId}) => {
//   const textareaRef = useRef(null);
//   const editorContainerRef = useRef(null);
//   useEffect(() => {
//     async function init(){
//     if (textareaRef.current) {
//       textareaRef.current = CodeMirror.fromTextArea(document.getElementById('realtimeEditor'), {
//         mode: {name:'javascript', json: true},
//         theme: 'darcula',
//         autoCloseTags: true,
//         autoCloseBrackets: true,
//         lineNumbers: true,
//       });

//       textareaRef.current.on('change', (instance, changes) => {
//         console.log('changes', changes);
//         const {origin} = changes;
//         const code = instance.getValue();
//         if(origin !== 'setValue') {
//           socketRef.current.emit(ACTIONS.CODE_CHANGE, {
//             roomId,
//             code
//           })
//         }
//         console.log('code', code);
//       })

//       // textareaRef.current.setValue(`console.log('hello)`);

//       socketRef.current.on(ACTIONS.CODE_CHANGE, ({code}) => {
//         if(code !== null){
//           textareaRef.current.setValue(code);
//         }
//       })


//       const codeMirrorWrapper = textareaRef.current.getWrapperElement();
//       codeMirrorWrapper.style.fontSize = '24px'; 
//       textareaRef.current.setSize('100%', '100%');
//       return () => {
//         textareaRef.current.toTextArea();
//       };
//     }
//   }
//   init();

// }, []);

//   return (
//     <div ref={editorContainerRef} className="h-screen flex flex-col">
//       <textarea ref={textareaRef} id="realtimeEditor" className="flex-grow bg-transparent bg-green-800" />
//     </div>
//   );
// };

// export default Editor;


