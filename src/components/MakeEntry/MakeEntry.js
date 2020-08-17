import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { green, yellow } from "@material-ui/core/colors";
import {
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  FormControl,
  FormLabel,
  withStyles,
  Slider,
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import Swal from "sweetalert2";
import Paper from "@material-ui/core/Paper";
import "./MakeEntry.css";
import moment from "moment";

const GreenRadio = withStyles({
  root: {
    color: green[400],
    "&$checked": {
      color: green[600],
    },
  },
  checked: {},
})((props) => <Radio color="default" {...props} />);

const YellowRadio = withStyles({
  root: {
    color: yellow[400],
    "&$checked": {
      color: yellow[600],
    },
  },
  checked: {},
})((props) => <Radio color="default" {...props} />);

//The purpose of this page is to capture the student's activity the past pay period
//REVIEW: Do we want job and activity to be sepate questions?
//They technically both go into the same column
//Either can work, but I think just asking one question is easier
class MakeEntry extends Component {
  state = {
    lcf_id: this.props.user.lcf_id,
    pass_class: "",
    gpa: 0,
    absent: 0,
    tardy: 0,
    late: 0,
    truant: 0,
    clean_attend: 0,
    detent_hours: null,
    // after_school: "",
    act_or_job: null,
    passed_ua: null,
    current_service_hours: 0,
    hw_rm_attended: null,
    comments: null,
    error: false,
    pay_day_error: false,
    dupeEntry: false,
  };

  componentDidMount() {
    this.props.dispatch({
      type: "GET_STUDENTS",
    });

    this.props.dispatch({
      type: "FETCH_ENTRIES_FOR_ADMIN",
    });
  }

  handleChange = (event, fieldName) => {
    this.setState({ [fieldName]: event.target.value });
  };
  handleChangeGpa = (event, gpa) => {
    gpa = Number(gpa);
    this.setState({
      gpa,
    });
  };
  handleChangeAbsent = (event, absent) => {
    absent = Number(absent);
    this.setState({
      absent,
    });
  };
  handleChangeTardy = (event, tardy) => {
    tardy = Number(tardy);
    this.setState({
      tardy,
    });
  };
  handleChangeLate = (event, late) => {
    late = Number(late);
    this.setState({
      late,
    });
  };
  handleChangeTruant = (event, truant) => {
    truant = Number(truant);
    this.setState({
      truant,
    });
  };
  handleChangeAttendance = (event, clean_attend) => {
    clean_attend = Number(clean_attend);
    this.setState({
      clean_attend,
    });
  };

  submitInfo = (event) => {
    event.preventDefault();
    const {
      pass_class,
      lcf_id,
      gpa,
      absent,
      tardy,
      late,
      truant,
      clean_attend,
      detent_hours,
      act_or_job,
      passed_ua,
      current_service_hours,
      hw_rm_attended,
      comments,
    } = this.state;
    if (
      pass_class === null ||
      detent_hours === null ||
      act_or_job === null ||
      passed_ua === null ||
      current_service_hours === null ||
      current_service_hours === undefined ||
      current_service_hours === "" ||
      hw_rm_attended === null
    ) {
      this.setState({
        error: true,
      });

      setTimeout(() => {
        this.setState({
          error: false,
        });
      }, 5000);
      return;
    }


    let historyEntries = this.props.studentHistory;

    let date = moment();
    let previous_pay_day = moment("2020-08-10T00:00:00.000-05");
    let pay_day = moment(previous_pay_day);

    function getDate() {
      if (date >= pay_day) {
        previous_pay_day = pay_day;
        pay_day = moment(previous_pay_day).add(2, "week");
        getDate();
      }
    }
    getDate();

    previous_pay_day = moment(previous_pay_day).format("MMMM Do YYYY");
    pay_day = moment(pay_day).format("MMMM Do YYYY");

    for (let history of historyEntries) {
      let history_pay_day = moment.utc(history.pay_day).format("MMMM Do YYYY");

      /////////////
      console.log(date, previous_pay_day)
      console.log('Trying to compare', history_pay_day, 'and', pay_day)

      ////////////

      if (history_pay_day === pay_day) {
        this.setState({
          pay_day_error: true,
        });

        setTimeout(() => {
          this.setState({
            pay_day_error: false,
          });
        }, 5000);
        return;
      } //end if statement
    }

    Swal.fire({
      title: "Please confirm details below",
      html: `1. Passing classes: ${pass_class} </br>
      2. GPA: ${gpa} </br>
      3a. Days absent: ${absent} </br>
      3b. Days tardy: ${tardy} </br>
      3c. Days late ${late} </br>
      3d. Days truant ${truant} </br>
      3e. Days punctual: ${clean_attend} </br>
      4. Detention hours: ${detent_hours} </br>
      5. Job or after school activities: ${act_or_job} </br>
      6. Drug free: ${passed_ua} </br>
      7. service hours: ${current_service_hours} </br>
      8. homeroom attendence: ${hw_rm_attended} </br>
      9. comments: ${comments}`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#5cb85c",
      cancelButtonColor: "#fcb70a",
      confirmButtonText: "Confirm my entry",
    }).then((result) => {
      if (result.value) {
        this.props.dispatch({
          type: "ADD_ENTRY",
          payload: {
            pass_class: pass_class,
            lcf_id: lcf_id,
            gpa: gpa,
            absent: absent,
            tardy: tardy,
            late: late,
            truant: truant,
            clean_attend: clean_attend,
            detent_hours: detent_hours,
            // after_school: after_school,
            act_or_job: act_or_job,
            passed_ua: passed_ua,
            current_service_hours: current_service_hours,
            hw_rm_attended: hw_rm_attended,
            comments: comments,
          },
        });
        Swal.fire("Success!", "Your entry has been logged.", "success");
        this.props.history.push("/home");
        console.log("state is", this.state);
      }
    });
  }; //ends SubmitInfo

  render() {
    const inputProps = {
      max: 10,
      min: 0,
    };
    const marks = [
      {
        value: 0,
        label: "0",
      },
      {
        value: 1,
        label: "1",
      },
      {
        value: 2,
        label: "2",
      },
      {
        value: 3,
        label: "3",
      },
      {
        value: 4,
        label: "4",
      },
      {
        value: 5,
        label: "5",
      },
      {
        value: 6,
        label: "6",
      },
      {
        value: 7,
        label: "7",
      },
      {
        value: 8,
        label: "8",
      },
      {
        value: 9,
        label: "9",
      },
      {
        value: 10,
        label: "10",
      },
    ];
    const marksGpa = [
      {
        value: 0,
        label: "0",
      },
      {
        value: 0.5,
        label: "0.5",
      },
      {
        value: 1,
        label: "1",
      },
      {
        value: 1.5,
        label: "1.5",
      },
      {
        value: 2,
        label: "2",
      },
      {
        value: 2.5,
        label: "2.5",
      },
      {
        value: 3,
        label: "3",
      },
      {
        value: 3.5,
        label: "3.5",
      },
      {
        value: 4,
        label: "4",
      },
    ];

    let { entries } = this.props;
    let date = moment();
    let previous_pay_day = moment("2020-08-10T00:00:00.000-05"); //midnight central time
    let pay_day = moment(previous_pay_day);

    function getDate() {
      if (date >= pay_day) {
        previous_pay_day = pay_day;
        pay_day = moment(previous_pay_day).add(2, "week");
        getDate();
      }
    }
    getDate();

    previous_pay_day = moment(previous_pay_day).format("MMMM Do YYYY");
    pay_day = moment(pay_day).format("MMMM Do YYYY");

    const studentList = this.props.students;

    for (let student of studentList) {
      if (
        this.props.user.lcf_id === student.lcf_id &&
        student.inactive === "yes"
      ) {
        return (
          <div>
            <Paper elevation={5} style={{ margin: "5%", padding: "5%" }}>
              <center>
                <h2>
                  Sorry, you cannot make an entry at this moment. Your account
                  is currently inactive, please contact the admin for further
                  details.
                </h2>
              </center>
              <center>
                <h2>Thank you!</h2>
              </center>
            </Paper>
          </div>
        );
      }
    }

    for (let entry of entries) {
      entry.pay_day = new Date(entry.pay_day);
      entry.previous_pay_day = new Date(entry.previous_pay_day);

      if (
        this.props.user.lcf_id === entry.lcf_id &&
        (entry.pay_day > date || entry.previous_pay_day <= date)
      ) {
        //TODO: ADD History conditional so
        //no duplicate entries can be submitted (i.e.checked against history and entry tables)
        return (
          <div>
            <Paper elevation={5} style={{ margin: "5%", padding: "5%" }}>
              <center>
                <h2>
                  Entry already submitted for this pay period, please check back
                  next pay period
                </h2>
              </center>
              <center>
                <h2>Thank you!</h2>
              </center>
            </Paper>
          </div>
        );
      }
    }

    return (
      <div>
        <br />
        {this.state.error === true && (
          <Alert className="error" style={{}} severity="error">
            Please fill out all of the required fields
          </Alert>
        )}
        <br />
        {this.state.pay_day_error === true && (
          <Alert className="error" style={{}} severity="error">
            Sorry, you already have an entry on record for this pay period, your
            entry has not been saved successfully!
          </Alert>
        )}
        <h3 style={{ textAlign: "center", margin: "2%" }}>
          This entry is for the week of: {previous_pay_day} - {pay_day}
        </h3>
        <Paper
          elevation={5}
          style={{
            padding: "5%",
            marginLeft: "5%",
            marginRight: "5%",
            marginBottom: "5%",
          }}
        >
          <form onSubmit={this.submitInfo}>
            <FormControl component="fieldset">
              <FormLabel component="legend" style={{ color: "black" }}>
                1. Are you passing all your classes?
              </FormLabel>
              <RadioGroup
                required
                aria-label="pass_class"
                name="pass_class"
                value={this.state.pass_class}
                onChange={(event) => this.handleChange(event, "pass_class")}
              >
                <FormControlLabel
                  value="Yes"
                  control={<GreenRadio />}
                  label="Yes"
                />
                <FormControlLabel
                  value="No"
                  control={<YellowRadio />}
                  label="No"
                />
              </RadioGroup>
            </FormControl>
            <p>2. What is your current GPA?</p>
            <Slider
              style={{
                width: "40%",
              }}
              required
              defaultValue={this.state.gpa}
              type="number"
              aria-labelledby="discrete-slider-custom"
              step={0.01}
              valueLabelDisplay="auto"
              max={4}
              min={0}
              label="GPA"
              name="GPA"
              value={this.state.gpa}
              onChange={this.handleChangeGpa}
              marks={marksGpa}
            />{" "}
            <span style={{ marginLeft: 20 }}>GPA: {this.state.gpa}</span>
            <p>
              3a. How many days were you absent from school this pay period?
            </p>
            <Slider
              style={{
                width: "40%",
              }}
              required
              defaultValue={this.state.absent}
              type="number"
              aria-labelledby="discrete-slider-custom"
              step={1}
              valueLabelDisplay="auto"
              max={10}
              min={0}
              label="absent"
              name="absent"
              value={this.state.absent}
              onChange={this.handleChangeAbsent}
              marks={marks}
            />
            <span style={{ marginLeft: 20 }}>
              Days absent: {this.state.absent}
            </span>
            <p>3b. How many school days were you tardy this pay period?</p>
            <Slider
              style={{
                width: "40%",
              }}
              required
              defaultValue={this.state.tardy}
              type="number"
              aria-labelledby="discrete-slider-custom"
              step={1}
              valueLabelDisplay="auto"
              max={10}
              min={0}
              label="tardy"
              name="tardy"
              value={this.state.tardy}
              onChange={this.handleChangeTardy}
              marks={marks}
            />{" "}
            <span style={{ marginLeft: 20 }}>
              Days tardy: {this.state.tardy}
            </span>
            <p>3c. How many school days were you late this pay period?</p>
            <Slider
              style={{
                width: "40%",
              }}
              required
              defaultValue={this.state.late}
              type="number"
              aria-labelledby="discrete-slider-custom"
              step={1}
              valueLabelDisplay="auto"
              max={10}
              min={0}
              label="late"
              name="late"
              value={this.state.late}
              onChange={this.handleChangeLate}
              marks={marks}
            />{" "}
            <span style={{ marginLeft: 20 }}>Days late: {this.state.late}</span>
            <p>3d. How many school days were you truant this pay period?</p>
            <Slider
              style={{
                width: "40%",
              }}
              required
              defaultValue={this.state.truant}
              type="number"
              aria-labelledby="discrete-slider-custom"
              step={1}
              valueLabelDisplay="auto"
              max={10}
              min={0}
              label="truant"
              name="truant"
              value={this.state.truant}
              onChange={this.handleChangeTruant}
              marks={marks}
            />{" "}
            <span style={{ marginLeft: 20 }}>
              Days truant: {this.state.truant}
            </span>
            <p>
              3e. How many school days were you punctual for this pay period?
              <br />
              (no tardies, no truancy, no lateness)
            </p>
            <Slider
              style={{
                width: "40%",
              }}
              required
              defaultValue={this.state.clean_attend}
              type="number"
              aria-labelledby="discrete-slider-custom"
              step={1}
              valueLabelDisplay="auto"
              max={10}
              min={0}
              label="attendance"
              name="attendance"
              value={this.state.clean_attend}
              onChange={this.handleChangeAttendance}
              marks={marks}
            />{" "}
            <span style={{ marginLeft: 20 }}>
              Attendance: {this.state.clean_attend}
            </span>
            <br />
            <br />
            <FormControl component="fieldset">
              <FormLabel component="legend" style={{ color: "black" }}>
                4. Do you have detention hours at school?
              </FormLabel>
              <RadioGroup
                aria-label="detent_hours"
                name="detent_hours"
                value={this.state.detent_hours}
                onChange={(event) => this.handleChange(event, "detent_hours")}
              >
                <FormControlLabel
                  value="No"
                  control={<GreenRadio />}
                  label="No"
                />
                <FormControlLabel
                  value="Yes"
                  control={<YellowRadio />}
                  label="Yes"
                />
              </RadioGroup>
            </FormControl>{" "}
            <br />
            <br />
            <FormControl component="fieldset">
              <FormLabel component="legend" style={{ color: "black" }}>
                5. Are you involved in any after school activity or job? <br />
                (At school or at Legacy)
              </FormLabel>
              <RadioGroup
                aria-label="act_or_job"
                name="act_or_job"
                value={this.state.act_or_job}
                onChange={(event) => this.handleChange(event, "act_or_job")}
              >
                <FormControlLabel
                  value="Yes"
                  control={<GreenRadio />}
                  label="Yes"
                />
                <FormControlLabel
                  value="No"
                  control={<YellowRadio />}
                  label="No"
                />
              </RadioGroup>
            </FormControl>
            <br />
            <br />
            {/* <FormControl component="fieldset">
              <FormLabel component="legend" style={{ color: "black" }}>
                6. Do you have a job?
              </FormLabel>
              <RadioGroup
                aria-label="act_or_job"
                name="act_or_job"
                value={this.state.act_or_job}
                onChange={(event) => this.handleChange(event, "act_or_job")}
              >
                <FormControlLabel
                  value="Yes"
                  control={<GreenRadio />}
                  label="Yes"
                />
                <FormControlLabel value="No" control={<Radio />} label="No" />
              </RadioGroup>
            </FormControl> <br/> <br/> */}
            <FormControl component="fieldset">
              <FormLabel component="legend" style={{ color: "black" }}>
                6. Are you living a drug free life?
              </FormLabel>
              <RadioGroup
                aria-label="passed_ua"
                name="passed_ua"
                value={this.state.passed_ua}
                onChange={(event) => this.handleChange(event, "passed_ua")}
              >
                <FormControlLabel
                  value="Yes"
                  control={<GreenRadio />}
                  label="Yes"
                />
                <FormControlLabel
                  value="No"
                  control={<YellowRadio />}
                  label="No"
                />
              </RadioGroup>
            </FormControl>
            <br />
            <p>
              7. How many service hours did you do the past 2 weeks?
              <TextField
                style={{
                  backgroundColor: "white",
                  margin: "5px",
                  width: "130px",
                  verticalAlign: "middle",
                }}
                variant="outlined"
                required
                fullWidth
                label="service hours"
                name="service hours"
                // sets value of input to local state
                value={this.state.current_service_hours}
                type="number"
                inputProps={inputProps}
                maxLength={1000}
                onChange={(event) =>
                  this.handleChange(event, "current_service_hours")
                } //onChange of input values set local state
              />
            </p>
            <FormControl component="fieldset">
              <FormLabel component="legend" style={{ color: "black" }}>
                8. Were you ontime for mandatory homerooms this pay period?
              </FormLabel>
              <RadioGroup
                aria-label="hw_rm_attended"
                name="hw_rm_attended"
                value={this.state.hw_rm_attended}
                onChange={(event) => this.handleChange(event, "hw_rm_attended")}
              >
                <FormControlLabel
                  value="Yes"
                  control={<GreenRadio />}
                  label="Yes"
                />
                <FormControlLabel
                  value="No"
                  control={<YellowRadio />}
                  label="No"
                />
              </RadioGroup>
            </FormControl>{" "}
            <br /> <br />
            <p>9. Any comments you would like to leave this pay period?</p>
            <TextField
              style={{
                backgroundColor: "white",
                margin: "5px",
                width: "100%",
              }}
              //per material UI changes textfield to act like a textarea tag
              multiline
              //input field takes up for rows by defaults
              rows={4}
              //...will expand up to 8 rows
              rowsMax={8}
              variant="outlined"
              fullWidth
              label="Write comments here"
              name="comments"
              // sets value of input to local state
              value={this.state.comments}
              type="text"
              maxLength={1000}
              onChange={(event) => this.handleChange(event, "comments")} //onChange of input values set local state
            />{" "}
            <center>
              <Button
                style={{
                  marginTop: "3%",
                  marginLeft: "5%",
                  marginRight: "5%",
                  backgroundColor: "#b89c09",
                  color: "white",
                }}
                variant="contained"
                className="button"
                onClick={() => {
                  this.props.history.push("/home");
                }}
              >
                Cancel Entry
              </Button>

              <Button
                style={{
                  marginTop: "3%",
                  marginLeft: "5%",
                  marginRight: "5%",
                  backgroundColor: "green",
                  color: "white",
                }}
                variant="contained"
                type="submit"
                color="primary"
                className="button"
              >
                Submit Entry
              </Button>
            </center>
          </form>
        </Paper>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.user,
  entries: state.students.studententriesadmin,
  students: state.students.studentlist,
  studentHistory: state.studentHistory.studentHistoryReducer,
});

export default withRouter(connect(mapStateToProps)(MakeEntry));
