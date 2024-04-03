const express = require('express');
const app = express();
const port = 3000;
const Ride = require('./models/activity.js')
const path = require('path');

const mongoose = require('mongoose');
const dbURI = 'mongodb+srv://charlieapolseed:1234@cluster0.trzg1a1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
//Connect to database using mongoose
mongoose.connect(dbURI)
    //If connection works, start the server
    .then((result) =>  app.listen(3000))
    .catch((err) => console.log(err));
;

// Set EJS as the view engine
app.set('view engine', 'ejs');

// Define the directory where your HTML files (views) are located
app.set('views', path.join(__dirname, 'views'));

// Optionally, you can define a static files directory (CSS, JS, images, etc.)
app.use(express.static(path.join(__dirname, 'styles')));


app.get('/add-activity', (req, res) => {
    const ride = new Ride({
        id: 11090720289,
        activity_name : "Terrible morning",
        distance : 10.3,
        avg_heartrate : 180.2,
        max_heartrate: 195,
        duration : 12345,
        map_info : {id: "a11090720289",
                resource_state: 2,
                summary_polyline: "}m~jGhc`jLoMqE{GwCyDwBoAPiPhH]s@s@_IY]cSrKe@@yCyAoBuBgH{L}AoKoAmNB{JL}@`B}DvAaFbB{BlBwEr@gC`@ADv@_@dEg@~B}AtB}Af@oWgDeBo@_DqBg@uD@}@~Lk[f@iCt@aN|@yZzCmTbD}N^yEKwDm@{DeBuFsAgGiGi^mAcJe@uF}CgJgD}DmMqSoFyDsEeE{JkOwDsCqK_Gyv@kp@yOiMoEuEoAs@wFm@uU?oSvGun@nDcQpHcE|@kB?e@M_@i@{AqKc@yAw@uAqWgZcEcDoBi@m\\\\uBl@gHvDsAVgJ}AaMqDeC[mRxBwQcAiy@bBaBf@wAjAqL~NeInMwCnDo@RoB_Fi@kCi@_M_A_Lm@iReAsEeEgJwA{D~@_N~Dyc@HiCMeDo@iDyEkL[}BhNaeBMqB_CaDM}AvBwI|CyFl@oBzBuSNqHe@uCmAaCeCiBeD_Bu@iAiA_GmG_N[{BSmHy@eCoA_A}GqAuAo@uG}GmQaPwLsL{AeAaDmA{WcDqPrBoGFgNdAeDBcCxBWDmDkDeDcBma@mFgKeDiEcCid@}\\ws@m]cCo@gBEgXxDcCAgBc@aEqCuu@cu@kH{EkIgDbIvDxGrE|u@lu@nErCnB`@tCAbWsDjEf@lu@d^`c@h\\jFvChE`BlE`A|`@rFnCpAlD`Dn@GtAwAp@SzSeAnGI~NoB|BDfU~C|EdC~\\p[tItIxBdAdGvApA`Ap@tCPbGXpBj@hB|EbKdAxF|@nAnDjBdCvBnAnCZdCS~IaC`Rc@tA_DbGmBxI?r@Pr@tBnCLrBeGfs@MfDgDf^u@bLXtBxCjGbA|Cj@lDNlDMvDgEtd@q@hKpGxOfArEz@xS|@rKh@tLt@hDjBbEp@AnB{B`KqOnLsNtAiApAg@hCW`t@iAbT`AxP}BxBPdK|CrL|BvB_@~FkDvBo@b[_@xBTjAp@|FfFtTlWlA~CzAxKf@p@v@P|Em@nHgCdJeE`l@uCxBc@hP{F~V[xD\\lBh@rHnHn]fYhg@xb@~JlFpDjC`KtOvMpKhMhSnElF`AvBb@pBrAnMrDhUfDvQnDlN\\|C@~BYjDeD|OmDxTeAda@i@vGi@xBwEnMqDhJo@|@l@rGx@PtCfBrXhEtBg@|AmBn@}CZaEGo@e@F_A~CkBjEkBrCuDrL?jNtBtQj@zD^fAbIbMhBvA~B|@nu@cc@lAMnDb@xBKRl@b@bFx@|Bl@PfDq@"
        },
        sport_type: "Ride",
    });

    ride.save().
        then((result) => {res.send(result)})
        .catch((err) => {console.log(err);
        })
})

app.get('/get-single-activity', (req, res) => {
    Ride.findById("660cae6ec909b02d02272d34")
        .then ((result) => {
            res.send(result);
        })
        .catch((err) => {
            console.log(err)});
})

//Home page
app.get('/', (req, res) => {
  res.render('index', {testVar: "HomePageTest"});
})

//All activities
app.get('/activities', (req, res) => {
    Ride.find().sort({ createdAt : -1 })
        .then((result) => {
            console.log("got data");
            res.render('activities', {data: result});
        })
    .catch((err) => {
        console.log("Oh no!");
        console.log(err)});
})





