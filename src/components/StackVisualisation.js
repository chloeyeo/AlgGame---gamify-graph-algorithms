const StackVisualisation = ({ stack = [] }) => {
  return (
    <div className="bg-white bg-opacity-50 rounded-lg shadow-md p-4">
      <h3 className="text-lg font-semibold mb-2">Stack</h3>
      <div className="flex flex-col-reverse gap-2">
        {stack.map((nodeId, index) => (
          <div
            key={index}
            className="bg-blue-100 border-2 border-blue-500 rounded p-2 text-center"
          >
            {nodeId}
          </div>
        ))}
        {stack.length === 0 && (
          <div className="text-gray-500 italic">Stack is empty</div>
        )}
      </div>
    </div>
  );
};

export default StackVisualisation;
