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
        console.log('======')

        let htmlForWebview = response.data.ProfileHTML;
        console.log(htmlForWebview);

        const panel = vscode.window.createWebviewPanel(
          'catCoding',
          'Cat Coding',
          vscode.ViewColumn.One,
          {
            // Enable scripts in the webview
            enableScripts: true
          }
        );
    
        // And set its HTML content
        panel.webview.html = getWebviewContentFromParam(htmlForWebview);

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

  // let webView = vscode.commands.registerCommand('catCoding.start', () => {
  //   // Create and show panel
  //   const panel = vscode.window.createWebviewPanel(
  //     'catCoding',
  //     'Cat Coding',
  //     vscode.ViewColumn.One,
  //     {}
  //   );

  //   // And set its HTML content
  //   panel.webview.html = getWebviewContent();
  // })

  // let disposable2 = vscode.commands.registerCommand('ts-vs-code-pyroscope.helloWorld2', () => 

  context.subscriptions.push(hellowWorldDisposable);
  context.subscriptions.push(sideBarDisposable);
}

function getWebviewContentFromParam(htmlForWebview: any) {
  return `${htmlForWebview}`;
}

function getWebviewContent() {
  return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Cat Coding</title>
    </head>
    <body>
        
        <iframe src="https://flamegraph.com/share/example-single" width="800" height=450" />
    </body>
    </html>`;
}

// this method is called when your extension is deactivated
export function deactivate() {}
