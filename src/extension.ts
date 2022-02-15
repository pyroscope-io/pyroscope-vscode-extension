// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
const moment = require('moment');
const axios = require('axios');
// import fetch from 'node-fetch';
// const fetch = require('node-fetch');


// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "ts-vs-code-pyroscope" is now active!');

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let hellowWorldDisposable = vscode.commands.registerCommand('ts-vs-code-pyroscope.helloWorld', () => {
    // The code you place here will be executed every time your command is executed
    // Display a message box to the user
    console.log('Hello World!');
    let now = moment().format('LLLL');

    console.log('NOW', now);
    vscode.window.showInformationMessage('Hello World from ts-vs-code-pyroscope!');
  });

  let sideBarDisposable = vscode.commands.registerCommand('ts-vs-code-pyroscope.sideBar', (resource: vscode.Uri) => {
    console.log('sideBar!');
    vscode.window.showInformationMessage('Context menu thing triggered');
    console.dir(resource);

    vscode.workspace.openTextDocument(resource).then((a: vscode.TextDocument) => {
      // console.log('opened');
      // console.log(a.getText());
      // console.log('dir...');
      // console.dir(a);

      axios.post('https://slackbot.pyroscope.io/playground/run-code', a.getText(),{
        headers: {'Content-Type': 'text/plain'}
      })
      .then((response: any) => {
        // handle success
        console.log(response);
      })
      .catch(function (error: any) {
        // handle error
        console.log(error);
      })
      .then(function () {
        // always executed
      });

      // vscode.window.showTextDocument(a, 1, false).then(e => {
      //   e.edit(edit => {
      //     edit.insert(new vscode.Position(0, 0), "Your advertisement here");
      //   });
      // });
    }, (error: any) => {
      console.error(error);
      debugger;
    });
  });

  // let disposable2 = vscode.commands.registerCommand('ts-vs-code-pyroscope.helloWorld2', () => 

  context.subscriptions.push(hellowWorldDisposable);
  context.subscriptions.push(sideBarDisposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
