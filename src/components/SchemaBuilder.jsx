import React, { useState } from "react";
import { Button } from "./ui/button";

const fieldTypes = ["string", "number", "nested"];


const generateSchemaJSON = (fields) => {
  const schema = {};
  fields.forEach((field) => {
    if (!field.key) return;
    if (field.type === "nested") {
      schema[field.key] = {
        type: "object",
        properties: generateSchemaJSON(field.children || []),
      };
    } else {
      schema[field.key] = {
        type: field.type,
        default: field.type === "string" ? "" : 0,
      };
    }
  });
  return schema;
};

const SchemaBuilder = () => {
  const [fields, setFields] = useState([]);

  const addField = () => {
    setFields([...fields, { key: "", type: "string", children: [] }]);
  };

  const updateField = (index, updatedField) => {
    const newFields = [...fields];
    newFields[index] = updatedField;
    setFields(newFields);
  };

  const deleteField = (index) => {
    const newFields = [...fields];
    newFields.splice(index, 1);
    setFields(newFields);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">🛠️ JSON Schema Builder</h1>
      <Button onClick={addField}>➕ Add Field</Button>


      <div className="space-y-4">
        {fields.map((field, index) => (
          <FieldEditor
            key={index}
            field={field}
            onChange={(updated) => updateField(index, updated)}
            onDelete={() => deleteField(index)}
          />
        ))}
      </div>

      {/*Preview Section */}
      <div className="mt-6 bg-gray-900 text-white p-4 rounded">
        <h2 className="text-lg font-semibold mb-2">🧾 Live JSON Preview</h2>
        <pre className="text-sm overflow-x-auto whitespace-pre-wrap">
          {JSON.stringify(generateSchemaJSON(fields), null, 2)}
        </pre>
      </div>
    </div>
  );
};

const FieldEditor = ({ field, onChange, onDelete }) => {
  const handleKeyChange = (e) => {
    onChange({ ...field, key: e.target.value });
  };

  const handleTypeChange = (e) => {
    const newType = e.target.value;
    onChange({
      ...field,
      type: newType,
      children: newType === "nested" ? field.children || [] : undefined,
    });
  };

  const addNestedField = () => {
    const updatedChildren = [...(field.children || []), { key: "", type: "string", children: [] }];
    onChange({ ...field, children: updatedChildren });
  };

  const updateNestedField = (index, updatedNestedField) => {
    const newChildren = [...field.children];
    newChildren[index] = updatedNestedField;
    onChange({ ...field, children: newChildren });
  };

  const deleteNestedField = (index) => {
    const newChildren = [...field.children];
    newChildren.splice(index, 1);
    onChange({ ...field, children: newChildren });
  };

  return (
    <div className="border p-4 rounded bg-white">
      <div className="flex items-center gap-4 mb-2">
        <input
          type="text"
          placeholder="Field key"
          value={field.key}
          onChange={handleKeyChange}
          className="border px-3 py-2 rounded w-1/3"
        />
        <select
          value={field.type}
          onChange={handleTypeChange}
          className="border px-3 py-2 rounded"
        >
          <option value="string">String</option>
          <option value="number">Number</option>
          <option value="nested">Nested</option>
        </select>
        <Button
  onClick={onDelete}
  className="bg-red-400 text-white hover:bg-red-700"
>
  🗑️ Delete
</Button>

      </div>

      {field.type === "nested" && (
        <div className="ml-6 mt-2 border-l-2 pl-4">
          <button
            onClick={addNestedField}
            className="text-sm bg-blue-200 px-2 py-1 rounded mb-2"
          >
            ➕ Add Nested Field
          </button>
          <div className="space-y-2">
            {field.children.map((child, index) => (
              <FieldEditor
                key={index}
                field={child}
                onChange={(updated) => updateNestedField(index, updated)}
                onDelete={() => deleteNestedField(index)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SchemaBuilder;
