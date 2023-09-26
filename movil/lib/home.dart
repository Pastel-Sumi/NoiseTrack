import 'package:flutter/material.dart';
import 'package:noisetrack/services/notification_services.dart';

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'NoiseTrack Demo',
      theme: ThemeData(
        // This is the theme of your application.
        //
        // TRY THIS: Try running your application with "flutter run". You'll see
        // the application has a blue toolbar. Then, without quitting the app,
        // try changing the seedColor in the colorScheme below to Colors.green
        // and then invoke "hot reload" (save your changes or press the "hot
        // reload" button in a Flutter-supported IDE, or press "r" if you used
        // the command line to start the app).
        //
        // Notice that the counter didn't reset back to zero; the application
        // state is not lost during the reload. To reset the state, use hot
        // restart instead.
        //
        // This works for code too, not just values: Most code changes can be
        // tested with just a hot reload.
        colorScheme: const ColorScheme(
          brightness: Brightness.light,
          primary: Colors.blueGrey,
          onPrimary: Colors.white10,
          // Colors that are not relevant to AppBar in LIGHT mode:
          secondary: Colors.green,
          onSecondary: Colors.purple,
          background: Colors.black87,
          onBackground: Colors.orange,
          surface: Colors.black87,
          onSurface: Colors.white70,
          error: Colors.brown,
          onError: Colors.grey,
        ),
        useMaterial3: true,
      ),
      home: const MyApp(),
    );
  }
}


class MyHomePage extends StatefulWidget {
  const MyHomePage({super.key, required this.title});

  // This widget is the home page of your application. It is stateful, meaning
  // that it has a State object (defined below) that contains fields that affect
  // how it looks.

  // This class is the configuration for the state. It holds the values (in this
  // case the title) provided by the parent (in this case the App widget) and
  // used by the build method of the State. Fields in a Widget subclass are
  // always marked "final".

  final String title;

  @override
  State<MyHomePage> createState() => _MyHomePageState();
}

class ListTileApp extends StatelessWidget {
  const ListTileApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      theme: ThemeData(
          useMaterial3: true,
          scaffoldBackgroundColor: Colors.black12
      ),
      home: const ListTileExample(),
    );
  }
}

class ListTileExample extends StatelessWidget {
  const ListTileExample({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Alertas del día',
            style: TextStyle(
                color: Colors.white
            )),
        backgroundColor: Colors.black12,
      ),
      body: ListView(
        children: <Widget>[
          Card(
            color: Colors.red[300],
            child: ListTile(
              leading: Icon(Icons.warning),
              title: Text('5 personas expuestas por 10 [s] a 90 [db] en sala 3'),
            ),
          ),
          Card(
            color: Colors.red[300],
            child: ListTile(
              leading: Icon(Icons.warning),
              title: Text('5 personas expuestas por 9 [s] a 90 [db] en sala 3'),
            ),
          ),
          Card(
            color: Colors.yellow[300],
            child: ListTile(
              leading: Icon(Icons.crisis_alert),
              title: Text('5 personas expuestas por 8 [s] a 90 [db] en sala 3'),
            ),
          ),
          Card(
            color: Colors.yellow[300],
            child: ListTile(
              leading: Icon(Icons.crisis_alert),
              title: Text('5 personas expuestas por 57 [s] a 90 [db] en sala 3'),
            ),
          ),
        ],
      ),
    );
  }
}

class _MyHomePageState extends State<MyHomePage> {
  @override
  Widget build(BuildContext context) {
    // This method is rerun every time setState is called, for instance as done
    // by the _incrementCounter method above.
    //
    // The Flutter framework has been optimized to make rerunning build methods
    // fast, so that you can just rebuild anything that needs updating rather
    // than having to individually change instances of widgets.
    return Scaffold(
      appBar: AppBar(
        leading: const IconButton(
          icon: Icon(Icons.menu),
          tooltip: 'Navigation menu',
          onPressed: null,
        ),
        title:  Align(
          alignment: Alignment.center,
          child: Image.asset(
            'assets/image.png',
            width: 70,
            height: 70,
          ),
        ),
        actions: [
          Container(
            width: 70,
            height: 70,
            decoration: const BoxDecoration(
                image: DecorationImage(
                  image: AssetImage('assets/avatar.png'),
                  fit: BoxFit.cover,
                ),
                shape: BoxShape.circle
            ),
          )
        ],
      ),
      body: Center(
        // Center is a layout widget. It takes a single child and positions it
        // in the middle of the parent.
        child: Column(
          // Column is also a layout widget. It takes a list of children and
          // arranges them vertically. By default, it sizes itself to fit its
          // children horizontally, and tries to be as tall as its parent.
          //
          // Column has various properties to control how it sizes itself and
          // how it positions its children. Here we use mainAxisAlignment to
          // center the children vertically; the main axis here is the vertical
          // axis because Columns are vertical (the cross axis would be
          // horizontal).
          //
          // TRY THIS: Invoke "debug painting" (choose the "Toggle Debug Paint"
          // action in the IDE, or press "p" in the console), to see the
          // wireframe for each widget.
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            const Text(
              '',
            ),
            Text(
              '',
              style: Theme.of(context).textTheme.headlineMedium,
            ),
          ],
        ),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          showNotification();
          showDialog(
            context: context,
            builder: (ctx) => const AlertDialog(
              title: Text(""),
              insetPadding: EdgeInsets.zero,
              content: ListTileApp(),
              backgroundColor: Colors.transparent,
            ),
          );
        },
        tooltip: 'Increment',
        child: const Icon(Icons.add_alert),
      ), // This trailing comma makes auto-formatting nicer for build methods.
    );
  }
}
