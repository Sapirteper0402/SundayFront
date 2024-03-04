
export function dynamicCmpOrder() {
  const cmpsOrder = [
    "priority-picker",
    "status-picker"
    // "member-picker",
    // "date-picker",
  ];

  return cmpsOrder
}

export function generateDefaultDynamicCmp(type) {
    return {
        type: type + '-picker',
        info: {
            [`${type}Selected`]: "", // Assuming you want to concatenate "Selected" to the type for the key
            type: [] // Assuming this was intended to be an array property named "type"
        }
    }
  }
