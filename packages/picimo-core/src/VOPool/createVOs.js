
/**
 * Pre-allocate a bunch of vertex objects.
 * @private
 */
export default (voPool, maxAllocSize = 0) => {
  const max = voPool.capacity - voPool.usedCount - voPool.allocatedCount;
  const len = voPool.allocatedCount + (maxAllocSize > 0 && maxAllocSize < max ? maxAllocSize : max);

  for (let i = voPool.allocatedCount; i < len; i++) {
    const voArray = voPool.voArray.subarray(i);
    const vertexObject = voPool.descriptor.createVO(voArray);

    vertexObject.free = voPool.free.bind(voPool, vertexObject);

    voPool.availableVOs.push(vertexObject);
  }
};
