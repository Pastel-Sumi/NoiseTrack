import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:noisetrack/home.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:noisetrack/services/firebase_auth_services.dart';
import 'package:noisetrack/worker_login.dart';

class LoginPage extends StatefulWidget{
  const LoginPage({Key? key}) : super(key: key);

  @override
  State<LoginPage> createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage>{
 final FirebaseAuthService _auth = FirebaseAuthService();
 final TextEditingController _emailController = TextEditingController();
 final TextEditingController _passwordController = TextEditingController();

  @override
  //State<LoginPage> createState() => _LoginPageState();
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
                  controller: _passwordController,
                  obscureText: true,
                  decoration: const InputDecoration(
                    border: InputBorder.none,
                    hintText: 'Password',
                  ),
                ),
              ),
            ),
          ),
          const SizedBox(height:20),

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
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 25.0),
            child: GestureDetector(
              onTap: _worker,
              child: Container(
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  color: Colors.white70,
                  borderRadius: BorderRadius.circular(12),
                ),
                child: const Center(
                  child: Text(
                    'Soy trabajador',
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
          ],
      ),
    );
  }
  
  void _worker() async{
      Navigator.push(
        context,
        MaterialPageRoute(builder: (context) => const WorkerPage()),
      );

  }
 void _signIn() async{
   String email = _emailController.text;
   String password = _passwordController.text;

   User? user = await _auth.signInWithEmailAndPassword(email, password);

   if(user!= null){
     if (kDebugMode) {
       print("User is succesfully signedIn");
     }
     Navigator.push(
       context,
       MaterialPageRoute(builder: (context) => const MyHomePage(title: 'NoiseTrack', user: 'supervisor', place: null)),
     );
   }
 }
}