import crypto from 'node:crypto';


export function hashUserPassword(password){
    const salt=crypto.randomBytes(16).toString('hex');

    const hashedPassword=crypto.scryptSync(password,salt,64);

    return hashedPassword.toString('hex')+':'+salt;

}
export function verifiedPassword(storedPassword,suppliedassword){
    const [hashedPassword,salt]=storedPassword.split(':');
    const hashedPasswordBuf = Buffer.from(hashedPassword,'hex');
    const suppliedPasswordBuf = crypto.scryptSync(suppliedassword,salt,64);
    return crypto.timingSafeEqual(hashedPasswordBuf,suppliedPasswordBuf);

}