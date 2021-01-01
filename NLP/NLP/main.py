import random

from sklearn.feature_extraction.text import CountVectorizer, TfidfVectorizer
from sklearn.metrics import accuracy_score
from sklearn.svm import LinearSVC, SVC

stop_words_dk = ["ad","af","aldrig","alene","alle","allerede","alligevel","alt","altid","anden","andet","andre","at","bag","bare","begge","bl.a.","blandt","blev","blive","bliver","burde","bør","ca.","da","de","dem","den","denne","dens","der","derefter","deres","derfor","derfra","deri","dermed","derpå","derved","det","dette","dig","din","dine","disse","dit","dog","du","efter","egen","ej","eller","ellers","en","end","endnu","ene","eneste","enhver","ens","enten","er","et","f.eks.","far","fem","fik","fire","flere","flest","fleste","for","foran","fordi","forrige","fra","fx","få","får","før","først","gennem","gjorde","gjort","god","godt","gør","gøre","gørende","ham","han","hans","har","havde","have","hej","hel","heller","helt","hen","hende","hendes","henover","her","herefter","heri","hermed","herpå","hos","hun","hvad","hvem","hver","hvilke","hvilken","hvilkes","hvis","hvor","hvordan","hvorefter","hvorfor","hvorfra","hvorhen","hvori","hvorimod","hvornår","hvorved","i","igen","igennem","ikke","imellem","imens","imod","ind","indtil","ingen","intet","ja","jeg","jer","jeres","jo","kan","kom","komme","kommer","kun","kunne","lad","langs","lav","lave","lavet","lidt","lige","ligesom","lille","længere","man","mand","mange","med","meget","mellem","men","mens","mere","mest","mig","min","mindre","mindst","mine","mit","mod","må","måske","ned","nej","nemlig","ni","nogen","nogensinde","noget","nogle","nok","nu","ny","nyt","når","nær","næste","næsten","og","også","okay","om","omkring","op","os","otte","over","overalt","pga.","på","samme","sammen","se","seks","selv","selvom","senere","ser","ses","siden","sig","sige","sin","sine","sit","skal","skulle","som","stadig","stor","store","synes","syntes","syv","så","sådan","således","tag","tage","temmelig","thi","ti","tidligere","til","tilbage","tit","to","tre","ud","uden","udover","under","undtagen","var","ved","vi","via","vil","ville","vor","vore","vores","vær","være","været","øvrigt"]

train_data = [
    ["er dette et spørgsmål?", 0],
    ["kan jeg få noget sovs?", 0],
    ["kan jeg få noget sovs", 0],
    ["må jeg få noget sovs", 0],
    ["er dette dårligt nok",0],
    ["er jeg dårlig nok",0],
    ["vil du høre hvad jeg har at sige", 0],
    ["hvad er hendes relationer", 0],
    ["kan man spørge om noget",0],
    ["vil det give mening at man spørger",0],
    ["tror du at", 0],
    ["ved du at",0],
    ["giver det mening at",0],
    ["er du klog",0],
    ["du er klog",1],
    ["jeg synes", 1],
    ["tror jeg er ekspert i ml", 1],
    ["man ved aldrig du ved", 1],
    ["jeg er sej", 1],
    ["du er klog", 1],
    ["dette er nu ikke en joke",1],
    ["altså den konklusion vil jeg nu ikke lave", 1],
    ["det kan man helt sikkert godt sige", 1],
    ["det kan man dælme ikke sige",1],
    ["du skal gøre det",1],
    ["prøv at tænk på hvor mange der er høje",1]
]

test_data = random.sample(train_data,4)
#test_data =  [["kan man sige at jeg er god til det her",0]]




vectorizer = TfidfVectorizer(ngram_range=(1, 3))

training_features = vectorizer.fit_transform([e[0] for e in train_data])
test_features = vectorizer.transform([e[0] for e in test_data])

# Training
model = SVC()
model.fit(training_features, [e[1] for e in train_data])
y_pred = model.predict(test_features)
print([e[1] for e in test_data], y_pred)

# Evaluation
acc = accuracy_score([e[1] for e in test_data], y_pred)
print("Accuracy: {:.2f}".format(acc*100))

while True:
    l = input()
    pred = model.predict(vectorizer.transform([l]))
    if pred == 0:
        print("spørgsmål!")
    else:
        print("statement")