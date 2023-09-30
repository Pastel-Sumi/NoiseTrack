# Getting Started with Tracker
This project use python yolov8 model to make predictions of real time images and then track the classes that the user give in parameters. In this case we use a custom model "yolov8m_custom.pt" (it's to heavy to upload in git, but [here](https://drive.google.com/file/d/1u3UbiHKh4uM2S4uazFzHjBdJCgDJl-T2/view?usp=sharing) is the link to download it). To run this side of the project in your own computer this are the steps:

1- (Optional) Use conda to make an environment.

2- Install ultralytics dependences (this library have all we need to work with AI, yolov8 and more models) and ultravision with this command:

```ssh
pip install ultralytics
pip install supervision
```

The requirements.txt is on the way

3- When ultralytics is installed, this by default install pytorch with cpu dependences. The tracker need more power, so we need to install pytorch with CUDA dependences (we have to say that this project only works with CUDA, that are only avaible in nvidia GPUs sadly). In this [official pytorch page](https://pytorch.org/get-started/locally/) select the labels acording to your OS and may sure to select 11.7 and python (select conda if you are using it). This gives you the command to use in your terminal. For example, in windows 10 and using pip this is the given command:

```ssh
pip3 install --upgrade torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu117
```
Notice that the flag "--upgrade" is added, this because we already have a version of pytorch and we only need to upgrade it. We can see if the installation is ok by running python and type:
```python 
import torch
torch.__version__
```

And that's all, have fun!


# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
