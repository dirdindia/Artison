const fs = require('fs');
const path = require('path');

const files = [
  'src/screens/ContactScreen.js',
  'src/screens/FeedbackScreen.js',
  'src/screens/ProductDetailScreen.js',
  'src/screens/ProfileScreen.js',
  'src/screens/SignupScreen.js',
  'src/screens/SecurityScreen.js',
  'src/screens/LoginScreen.js',
  'src/screens/CheckoutScreen.js'
];

files.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (!fs.existsSync(filePath)) {
    console.log("Missing file:", filePath);
    return;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');

  // Skip if we already replaced it or it doesn't contain Alert.alert
  if (!content.includes('Alert.alert')) {
    console.log("No Alert.alert found in:", file);
    return;
  }

  // Inject import if not present
  if (!content.includes('import Toast from "react-native-toast-message";')) {
    // try to put it after react-native import
    content = content.replace(/(import .* from ['"]react-native['"];?\n)/, '$1import Toast from "react-native-toast-message";\n');
  }

  // Remove import { Alert } from 'react-native'
  content = content.replace(/Alert,\s*/g, '');
  content = content.replace(/,\s*Alert/g, '');
  
  // Replace Alert.alert("Title", "Message");
  content = content.replace(/Alert\.alert\(([^,]+),\s*(.*?)\);/g, (match, title, message) => {
    let type = "'info'";
    if (title.toLowerCase().includes('error') || title.toLowerCase().includes('fail') || title.toLowerCase().includes('missing') || title.toLowerCase().includes('denied')) {
      type = "'error'";
    } else if (title.toLowerCase().includes('success') || title.toLowerCase().includes('added') || title.toLowerCase().includes('thank')) {
      type = "'success'";
    }
    return `Toast.show({ type: ${type}, text1: ${title}, text2: ${message} });`;
  });

  fs.writeFileSync(filePath, content);
  console.log("Updated", file);
});
console.log('Done');
