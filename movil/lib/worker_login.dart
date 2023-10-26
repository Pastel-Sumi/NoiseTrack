import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:noisetrack/home.dart';
import 'package:noisetrack/api/firebase_service.dart';

class WorkerPage extends StatefulWidget{
  const WorkerPage({Key? key}) : super(key: key);

  @override
  State<WorkerPage> createState() => _LoginPageState();
}

class _LoginPageState extends State<WorkerPage>{
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();
  late final String place;

  @override
  void dispose(){
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  Widget build(BuildContext context){
    return Scaffold(
      backgroundColor: Colors.black12,
      body: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Image.asset(
            'assets/image.png',
            width: 80,
            height: 80,
          ),
          const SizedBox(height:20),
          Padding(padding: const EdgeInsets.symmetric(horizontal: 25.0),
            child: Container(
              decoration: BoxDecoration(
                color: Colors.grey[200],
                border: Border.all(color: Colors.white),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Padding(
                padding: const EdgeInsets.only(left: 20.0),
                child: TextField(
                  controller: _emailController,
                  decoration: const InputDecoration(
                    border: InputBorder.none,
                    hintText: 'Email',
                  ),
                ),
              ),
            ),
          ),
          const SizedBox(height:10),


          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 25.0),
            child: GestureDetector(
              onTap: _signIn,
              child: Container(
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  color: Colors.white70,
                  borderRadius: BorderRadius.circular(12),
                ),
                child: const Center(
                  child: Text(
                    'Sign In',
                    style: TextStyle(
                      color: Colors.black,
                      fontWeight: FontWeight.bold,
                      fontSize: 18,
                    ),
                  ),
                ),
              ),
            ),
          ),
          const SizedBox(height: 10),
          const Text('¿No tienes cuenta? Contacta con tu supervisor.',style: TextStyle(fontWeight: FontWeight.bold, color: Colors.white))
        ],
      ),
    );
  }

  void _signIn() async{
    String email = _emailController.text;
    place = await getPlace(email);
    if (kDebugMode) {
      print("\tPlace: $place");
    }
      Navigator.push(
        context,
        MaterialPageRoute(builder: (context) => MyHomePage(title: 'NoiseTrack',user: 'worker', place: place)),
      );
  }
}