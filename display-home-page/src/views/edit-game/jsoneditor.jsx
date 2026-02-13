import React, { useEffect, useRef } from 'react';
import JSONEditor from 'jsoneditor';
import 'jsoneditor/dist/jsoneditor.css';

// Custom hook to initialize and manage JSONEditor
export function useJSONEditor(containerRef, initialData,onJsonChange) {
  useEffect(() => {
    const container = containerRef.current;
    // const options = {mode:'code'}; // Configure options as needed
    const options = {mode:'code',onChangeText: (json) => {
              //Callback function to capture the updated JSON object
              if (onJsonChange) {
                onJsonChange(json);
              }
            }};// Configure options as needed

    const editor = new JSONEditor(container, options);

    // Load initial JSON data
    if (initialData) {
      editor.set(initialData);
    }

    return () => {
      // Clean up the JSONEditor instance when unmounting
      editor.destroy();
    };
  }, [containerRef, initialData,onJsonChange]);
}

// // Stateless functional component using the custom hook
// function MyJSONEditor() {
//   const containerRef = useRef(null);

//   // Initialize JSONEditor using the custom hook
//   useJSONEditor(containerRef, { key: 'value' }); // Initial JSON data

//   return (
//     <div>
//       <h1>JSON Editor</h1>
//       <div ref={containerRef}></div>
//     </div>
//   );
// }

// export default MyJSONEditor;
// import React, { useEffect, useRef } from 'react';
// import JSONEditor from 'jsoneditor';
// import 'jsoneditor/dist/jsoneditor.min.css'; // Import the CSS file

// function JSONEditorComponent({ initialJSON, onJsonChange }) {
//   const containerRef = useRef(null);
//   const editorRef = useRef(null);

//   useEffect(() => {
//     const container = containerRef.current;
//     const options = {
//       mode: 'code', // You can choose 'tree', 'view', 'form', or 'code'
//       onChangeText: (json) => {
//         // Callback function to capture the updated JSON object
//         if (onJsonChange) {
//           onJsonChange(json);
//         }
//       },
//     };

//     editorRef.current = new JSONEditor(container, options);

//     // Set the initial JSON data
//     editorRef.current.set(JSON.parse(initialJSON));

//     return () => {
//       // Clean up the JSONEditor instance when the component unmounts
//       if (editorRef.current) {
//         editorRef.current.destroy();
//       }
//     };
//   }, [initialJSON, onJsonChange]);

//   return <div ref={containerRef} style={{ height: '400px' }} />;
// }

// export default JSONEditorComponent;
