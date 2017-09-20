'use babel';
import * as _ from 'lodash';
class StyleHelper {
    constructor(sheet) {
        this.sheet = sheet;
    }
    setStyle(style) {
        _.map(style, (value, attribute) => {
            this.sheet[attribute] = value;
        });
    }
}
export default StyleHelper;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU3R5bGVIZWxwZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9saWIvaW50ZXJmYWNlL1N0eWxlSGVscGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFdBQVcsQ0FBQztBQUVaLE9BQU8sS0FBSyxDQUFDLE1BQU0sUUFBUSxDQUFDO0FBRTVCO0lBR0UsWUFBWSxLQUFLO1FBQ2YsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7SUFDckIsQ0FBQztJQUVNLFFBQVEsQ0FBQyxLQUFLO1FBQ25CLENBQUMsQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUMsS0FBSyxFQUFFLFNBQVM7WUFDNUIsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsR0FBRyxLQUFLLENBQUM7UUFDaEMsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0NBQ0Y7QUFFRCxlQUFlLFdBQVcsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG5pbXBvcnQgKiBhcyBfIGZyb20gJ2xvZGFzaCc7XG5cbmNsYXNzIFN0eWxlSGVscGVyIHtcbiAgc2hlZXQ6IENTU1N0eWxlRGVjbGFyYXRpb247XG5cbiAgY29uc3RydWN0b3Ioc2hlZXQpIHtcbiAgICB0aGlzLnNoZWV0ID0gc2hlZXQ7XG4gIH1cblxuICBwdWJsaWMgc2V0U3R5bGUoc3R5bGUpIHtcbiAgICBfLm1hcChzdHlsZSwgKHZhbHVlLCBhdHRyaWJ1dGUpID0+IHtcbiAgICAgIHRoaXMuc2hlZXRbYXR0cmlidXRlXSA9IHZhbHVlO1xuICAgIH0pO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFN0eWxlSGVscGVyO1xuIl19