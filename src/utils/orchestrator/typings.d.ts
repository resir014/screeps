interface IOrchestrator {
  /**
   * Converts global control level (GCL) to control points.
   *
   * @param {number} gcl The GCL to convert
   * @returns {number} The control points.
   * @memberof IOrchestrator
   */
  gclToControlPoints(gcl: number): number
  /**
   * Converts control points to GCL.
   *
   * @param {number} points The points to convert.
   * @returns {number} The GCL.
   * @memberof IOrchestrator
   */
  controlPointsToGcl(points: number): number
}
