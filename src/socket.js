import Ably from 'ably';

import dotenv from 'dotenv';

dotenv.config();

export const initSocket = async () => {
    const ably = new Ably.Realtime.Promise({ key: process.env.ABLY_API_KEY });
    const channel = ably.channels.get('room');

    return new Promise((resolve, reject) => {
        channel.attach((err) => {
            if (err) {
                reject(err);
            } else {
                resolve(channel);
            }
        });
    });
};
