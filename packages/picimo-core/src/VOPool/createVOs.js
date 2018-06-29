
/**
 * Pre-allocate a bunch of vertex objects.
 * @returns {number} number of allocated vertex objects
 * @private
 */
export default (voPool, maxAllocSize = 0) => {
  const max = voPool.capacity - voPool.usedCount - voPool.allocatedCount;
  const count = (maxAllocSize > 0 && maxAllocSize < max ? maxAllocSize : max);
  const len = voPool.allocatedCount + count;

  for (let i = voPool.allocatedCount; i < len; i++) {
    const voArray = voPool.voArray.subarray(i);
    const vertexObject = voPool.descriptor.createVO(voArray);

    vertexObject.free = voPool.free.bind(voPool, vertexObject);

    voPool.availableVOs.push(vertexObject);
  }

  return count;
};
