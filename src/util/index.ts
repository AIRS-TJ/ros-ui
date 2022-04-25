export * from './RosManager'

export const randomRGB = () => {
    return Math.ceil(Math.random() * 255)
}
export const rosQuaternionToGlobalTheta = function(orientation: any) {
    // See https://en.wikipedia.org/wiki/Conversion_between_quaternions_and_Euler_angles#Rotation_matrices
    // here we use [x y z] = R * [1 0 0]
    var q0 = orientation.w;
    var q1 = orientation.x;
    var q2 = orientation.y;
    var q3 = orientation.z;
    // Canvas rotation is clock wise and in degrees
    var degree = -Math.atan2(2 * (q0 * q3 + q1 * q2), 1 - 2 * (q2 * q2 + q3 * q3)) * 180.0 / Math.PI;
    return degree
};