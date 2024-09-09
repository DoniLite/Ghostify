// Use `tfjs-node`. Note that `tfjs` is imported indirectly by `tfjs-node`.
import * as tf from '@tensorflow/tfjs-node';

// Define a simple model.
const model = tf.sequential({
  layers: [
    tf.layers.dense({ units: 100, activation: 'relu', inputShape: [10] }),
    tf.layers.dense({ units: 1, activation: 'linear' }),
  ],
});

model.compile({ optimizer: 'SGD', loss: 'meanSquaredError' });

const xs = tf.randomNormal([100, 10]);
const ys = tf.randomNormal([100, 1]);

// Train the model.
model.fit(xs, ys, {
  epochs: 100,
  callbacks: {
    onEpochEnd: (epoch, log) =>
      console.log(`Epoch ${epoch}: loss = ${log.loss}`),
  },
});
