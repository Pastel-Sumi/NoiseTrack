import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter/material.dart';
import 'package:noisetrack/services/notification_services.dart';
import 'globals.dart' as globals;

//Firebase
import 'package:noisetrack/api/firebase_service.dart';

class MyApp extends StatelessWidget {
  const MyApp({super.key});
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'NoiseTrack',
      theme: ThemeData(
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
  final String title;
  final String user;
  const MyHomePage({super.key, required this.title, required this.user});
  @override
  State<MyHomePage> createState() => _MyHomePageState(user);
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
    DateTime now = DateTime.now();
    var day = now.day.toString();
    var month = now.month.toString();
    var year = now.year.toString();
    return Scaffold(
      appBar: AppBar(
          title: Text("Alertas del día $day/$month/$year",
          style: const TextStyle(
            color: Colors.white
          )),
          backgroundColor: Colors.black12,
      ),
      body: FutureBuilder(
        future: getNotifications(),
        builder: ((context, snapshot) {
          if (snapshot.hasData){

            return ListView.builder(
              itemCount: snapshot.data?.length,
              itemBuilder: (context, index) {
                var workers = snapshot.data?[index]['workers'].toString();
                var time = snapshot.data?[index]['time'].toString();
                var decibels = snapshot.data?[index]['db'].toString();
                var place = snapshot.data?[index]['place'];
                var type = snapshot.data?[index]['type'];
                //DateTime date = snapshot.data?[index]['created'];
                //var hour = date.hour.toString();
                String minute;
                //if (date.minute < 10) {
                //  minute = "0${date.minute}";
                //} else {
                //  minute = date.minute.toString();
                //}
                Color? color;
                Icon icon;
                // El if solo muestra las alertas del día
                //if(dates > Timestamp.fromDate(DateTime.now().subtract(const Duration(days:1)))){
                  if (type == 2){
                    color = Colors.red[300];
                    icon = const Icon(Icons.warning);
                    globals.warning++;
                  }
                  else{
                    color = Colors.yellow[300];
                    icon = const Icon(Icons.crisis_alert);
                    globals.alert++;
                  }


                  return Card(
                    color: color,
                    child: ListTile(
                      leading: icon,
                      title: Text('$workers personas expuestas por $time [s] a $decibels [db] en $place'),
                    ),
                  );


                //}
              },
          );
        }else{
            return const Center(
            child: CircularProgressIndicator()
          ); 
        }
        })),

    );
  }
}

class _MyHomePageState extends State<MyHomePage> {
  _MyHomePageState(String this.user);
  final user;
  @override
  Widget build(BuildContext context) {
    showNotification(user);
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
          mainAxisAlignment: MainAxisAlignment.start,
          mainAxisSize: MainAxisSize.max,
          children: <Widget>[
            Card(
              margin :const EdgeInsets.only(top: 40, left: 30.0, right: 30.0),
              color: Colors.yellow[300],
              child: ListTile(
                leading: const Icon(Icons.crisis_alert),
                title: Text(
                  'Alertas Moderadas: ${globals.alert.toString()}',
                  style: TextStyle(fontWeight: FontWeight.bold),
                ),
              ),
            ),
            Card(
              margin :const EdgeInsets.only(top: 15, left: 30.0, right: 30.0),
              color: Colors.red[300],
              child: ListTile(
                leading: const Icon(Icons.warning),
                title: Text(
                    'Alertas Críticas: ${globals.warning.toString()}',
                    style: const TextStyle(fontWeight: FontWeight.bold),
                ),
              ),
            ),
          ],
        ),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          showNotification('user');
          showDialog(
            context: context,
            builder: (ctx) => AlertDialog(
              title: const Text(""),
              insetPadding: EdgeInsets.zero,
              content: Builder(
                  builder: (context){
                    var height = MediaQuery.of(context).size.height;
                    var width = MediaQuery.of(context).size.width;
                    return SizedBox(
                      height: height - 10,
                      width: width - 10,
                        child: const ListTileApp(),
                    );
                  },
              ),
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
