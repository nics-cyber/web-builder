import React, { useState } from "react";
import { ChromePicker } from "react-color";
import { toPng } from "html-to-image";
import { Download, Undo, Redo, Maximize, Minimize, Upload } from "lucide-react";
import "./App.css";

function App() {
  // State for elements and templates
  const [elements, setElements] = useState([]);
  const [templates, setTemplates] = useState([
    {
      id: 1,
      name: "Template 1",
      thumbnail: "template1.jpg",
      elements: [{ id: 1, type: "text", content: "Welcome to My Website" }],
    },
    {
      id: 2,
      name: "Template 2",
      thumbnail: "template2.jpg",
      elements: [{ id: 1, type: "image", content: "https://via.placeholder.com/150" }],
    },
  ]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  // State for undo/redo
  const [history, setHistory] = useState([]);
  const [future, setFuture] = useState([]);

  // State for customization
  const [textColor, setTextColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [fontSize, setFontSize] = useState(16);
  const [fontFamily, setFontFamily] = useState("Arial");

  // Add an element to the canvas
  const addElement = (element) => {
    const newElement = { ...element, id: Date.now() };
    setElements([...elements, newElement]);
    saveState();
  };

  // Remove an element from the canvas
  const removeElement = (id) => {
    setElements(elements.filter((el) => el.id !== id));
    saveState();
  };

  // Update an element
  const updateElement = (id, updates) => {
    setElements(elements.map((el) => (el.id === id ? { ...el, ...updates } : el)));
    saveState();
  };

  // Select a template
  const selectTemplate = (template) => {
    setSelectedTemplate(template);
    setElements(template.elements || []);
    saveState();
  };

  // Save state for undo/redo
  const saveState = () => {
    setHistory([...history, { elements, selectedTemplate }]);
    setFuture([]);
  };

  // Undo functionality
  const undo = () => {
    if (history.length > 0) {
      const previousState = history[history.length - 1];
      setFuture([...future, { elements, selectedTemplate }]);
      setHistory(history.slice(0, -1));
      setElements(previousState.elements);
      setSelectedTemplate(previousState.selectedTemplate);
    }
  };

  // Redo functionality
  const redo = () => {
    if (future.length > 0) {
      const nextState = future[future.length - 1];
      setHistory([...history, { elements, selectedTemplate }]);
      setFuture(future.slice(0, -1));
      setElements(nextState.elements);
      setSelectedTemplate(nextState.selectedTemplate);
    }
  };

  // Download the website as an image
  const downloadWebsite = () => {
    const node = document.getElementById("website-canvas");
    toPng(node)
      .then((dataUrl) => {
        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = "website.png";
        link.click();
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="App">
      <nav className="navbar">
        <h1>Website Maker</h1>
        <div className="navbar-actions">
          <button onClick={undo} disabled={history.length === 0}>
            <Undo size={16} /> Undo
          </button>
          <button onClick={redo} disabled={future.length === 0}>
            <Redo size={16} /> Redo
          </button>
          <button onClick={downloadWebsite}>
            <Download size={16} /> Download
          </button>
        </div>
      </nav>
      <div className="builder-container">
        <div className="sidebar">
          <h3>Elements</h3>
          <div className="sidebar-element" onClick={() => addElement({ type: "text", content: "New Text" })}>
            Text
          </div>
          <div className="sidebar-element" onClick={() => addElement({ type: "image", content: "" })}>
            Image
          </div>
          <div className="sidebar-element" onClick={() => addElement({ type: "button", content: "Click Me" })}>
            Button
          </div>
        </div>
        <div id="website-canvas" className="canvas" style={{ backgroundColor: bgColor }}>
          {elements.map((el) => (
            <div
              key={el.id}
              className="element"
              style={{
                color: textColor,
                fontSize: `${fontSize}px`,
                fontFamily,
              }}
            >
              {el.type === "text" && (
                <input
                  type="text"
                  value={el.content}
                  onChange={(e) => updateElement(el.id, { content: e.target.value })}
                />
              )}
              {el.type === "image" && (
                <input
                  type="text"
                  value={el.content}
                  onChange={(e) => updateElement(el.id, { content: e.target.value })}
                  placeholder="Enter image URL"
                />
              )}
              {el.type === "button" && (
                <button
                  style={{
                    backgroundColor: textColor,
                    color: bgColor,
                    fontSize: `${fontSize}px`,
                    fontFamily,
                  }}
                >
                  {el.content}
                </button>
              )}
              <button onClick={() => removeElement(el.id)}>Remove</button>
            </div>
          ))}
        </div>
        <div className="customization-sidebar">
          <h3>Customization</h3>
          <div>
            <p>Text Color</p>
            <ChromePicker color={textColor} onChange={(c) => setTextColor(c.hex)} />
          </div>
          <div>
            <p>Background Color</p>
            <ChromePicker color={bgColor} onChange={(c) => setBgColor(c.hex)} />
          </div>
          <div>
            <p>Font Size</p>
            <input
              type="number"
              value={fontSize}
              onChange={(e) => setFontSize(parseInt(e.target.value))}
            />
          </div>
          <div>
            <p>Font Family</p>
            <select value={fontFamily} onChange={(e) => setFontFamily(e.target.value)}>
              <option value="Arial">Arial</option>
              <option value="Poppins">Poppins</option>
              <option value="Roboto">Roboto</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
