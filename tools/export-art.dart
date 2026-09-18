// Export the app's illustration set into assets/art at 2x display size.
// Run from the LensReport app repo (it needs that package's `image` dependency):
//   copy this file to <app repo>/tools/_export_art.dart, then `dart run tools/_export_art.dart`, then delete the copy.
import 'dart:io';
import 'package:image/image.dart' as img;

const out = 'C:/Users/shweth/Documents/GitHub Personal/shweth10.github.io/assets/art/';
const heroes = 'assets/expense/heroes/';
const icons = 'assets/expense/icons/';
const onb = 'assets/onboarding/';

final spec = <String, List<Object>>{
  'logo': ['C:/Users/shweth/Documents/GitHub Personal/shweth10.github.io/assets/images/app-logo.png', 128],
  'hero_saver': ['${heroes}hero_proud_saver.png', 480],
  'hero_ask_me': ['${heroes}hero_ask_me.png', 480],
  'hero_receipt_pile': ['${heroes}hero_receipt_pile.png', 360],
  'hero_on_track': ['${heroes}hero_on_track.png', 360],
  'hero_one_less': ['${heroes}hero_one_less_visit.png', 360],
  'hero_bills': ['${heroes}hero_bills.png', 360],
  'hero_coffee': ['${heroes}hero_coffee.png', 360],
  'goal_save_big': ['${onb}goal_save_big.png', 300],
  'goal_stick_budget': ['${onb}goal_stick_budget.png', 160],
  'goal_cut_subs': ['${onb}goal_cut_subscriptions.png', 160],
  'feat_log': ['${onb}feat_log.png', 160],
  'feat_tips': ['${onb}feat_tips.png', 160],
  'feat_nearby': ['${onb}feat_nearby.png', 160],
  'feat_nudge': ['${onb}feat_nudge.png', 160],
  'cat_coffee': ['${icons}cat_coffee.png', 128],
  'cat_groceries': ['${icons}cat_groceries.png', 128],
  'cat_fuel': ['${icons}cat_transport_fuel.png', 128],
  'cat_streaming': ['${icons}cat_streaming.png', 128],
  'cat_takeaway': ['${icons}cat_takeaway.png', 128],
  'cat_pharmacy': ['${icons}cat_pharmacy.png', 128],
  'cat_rent': ['${icons}cat_housing_rent.png', 128],
  'cat_electricity': ['${icons}cat_electricity.png', 128],
  'cat_dining': ['${icons}cat_dining.png', 128],
  'cat_phone': ['${icons}cat_phone_internet.png', 128],
  'cat_clothing': ['${icons}cat_clothing.png', 128],
  'cat_subs': ['${icons}cat_subscriptions.png', 128],
};

void main() {
  Directory(out).createSync(recursive: true);
  spec.forEach((name, v) {
    final f = File(v[0] as String);
    if (!f.existsSync()) { stderr.writeln('MISSING $name'); exitCode = 1; return; }
    var im = img.decodePng(f.readAsBytesSync())!;
    final size = v[1] as int;
    if (im.width > size) im = img.copyResize(im, width: size, interpolation: img.Interpolation.cubic);
    File('$out$name.png').writeAsBytesSync(img.encodePng(im, level: 9));
    stdout.writeln('$name ${im.width}px');
  });
}
